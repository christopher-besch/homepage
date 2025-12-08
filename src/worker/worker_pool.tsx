import { Piscina } from "piscina";
import { workerPath } from "../paths.js";
import { type ConvertImageProps, type ExportedImage } from "../convert_image.js";

let pool: Piscina;

export function startPool() {
    pool = new Piscina({ filename: workerPath });
}

const exportedImagePromises = new Map<string, [ConvertImageProps, Promise<ExportedImage>]>();

// We need to create a wrapper for all these worker functions because node.js only loads code for workers from separate files.
export async function convertImageOnPool(props: ConvertImageProps): Promise<ExportedImage> {
    // If the image is already being processed, we don't do it again.
    // Otherwise this could lead to a race condition.
    // Also, this is saving resources.
    if (!exportedImagePromises.has(props.inputPath)) {
        exportedImagePromises.set(props.inputPath, [props, pool.run(props, { name: "convertImage" }).catch((e) => { throw e; })]);
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
export async function embedImageOnPool(inputPath: string): Promise<Float32Array> {
    return pool.run(inputPath, { name: "embedImage" }).catch((e) => { throw e; });
}

// You may only run one of these at any time.
export async function embedSentencesOnPool(sentences: string[]): Promise<Float32Array[]> {
    return pool.run(sentences, { name: "embedSentences" }).catch((e) => { throw e; });
}
