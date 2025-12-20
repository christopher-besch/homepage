// Copyright 2025 Christopher Besch
// This file is published under the MIT license:

// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

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
