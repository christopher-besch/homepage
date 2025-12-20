import { Piscina } from "piscina";
import { embeddingWorkerPath, workerPath } from "../paths.js";
import { type ConvertImageProps, type ExportedImage } from "../convert_image.js";
import type { UnembeddedAsset } from "../immich.js";

let defaultPool: Piscina;
// We need a separate pool for transformer.js because it craps it's pants when running on multiple threads.
// This is also a problem even when we only import transformer.js so don't import it more than once, ever!
let embeddingPool: Piscina;

export function startPool() {
    defaultPool = new Piscina({ filename: workerPath, idleTimeout: Infinity });
    embeddingPool = new Piscina({ filename: embeddingWorkerPath, minThreads: 1, maxThreads: 1, idleTimeout: Infinity });
}

const exportedImagePromises = new Map<string, [ConvertImageProps, Promise<ExportedImage>]>();

// We need to create a wrapper for all these worker functions because node.js only loads code for workers from separate files.
export async function convertImageOnPool(props: ConvertImageProps): Promise<ExportedImage> {
    // If the image is already being processed, we don't do it again.
    // Otherwise this could lead to a race condition.
    // Also, this is saving resources.
    if (!exportedImagePromises.has(props.inputPath)) {
        // We don't need to catch this because we're awaiting this in the end of this function.
        exportedImagePromises.set(props.inputPath, [props, defaultPool.run(props, { name: "convertImage" })]);
    } else {
        const otherProps = exportedImagePromises.get(props.inputPath)![0];
        // Only ever create one kind of ConvertImageProps for each file path.
        // We only use the file path to identify the image.
        // Theoretically the same image could be exported with different settings.
        // Allowing that would make it a lot more difficult to prevent a race condition.
        if (JSON.stringify(otherProps) != JSON.stringify(props)) {
            throw new Error(`Trying to convert the same image twice with different settings: ${JSON.stringify(otherProps)} ${JSON.stringify(props)}`);
        }
    }
    return await exportedImagePromises.get(props.inputPath)![1];
}

// You may only run one of these at any time.
export async function embedImageOnPool(inputPath: string): Promise<number[]> {
    return embeddingPool.run(inputPath, { name: "embedImage" });
}

// You may only run one of these at any time.
export async function embedSentencesOnPool(sentences: string[]): Promise<number[][]> {
    return embeddingPool.run(sentences, { name: "embedSentences" });
}

// You may only run one of these at any time.
// We run this on a separate thread because we're running into network timeouts when running on the same thread with other things.
export async function loadImmichPortfolioWithoutEmbeddingOnPool(): Promise<UnembeddedAsset[]> {
    return defaultPool.run(undefined, { name: "loadImmichPortfolioWithoutEmbedding" });
}
