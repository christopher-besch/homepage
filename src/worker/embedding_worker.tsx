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

// This is very special, fragile stuff.
// transformer.js is very picky with who may import it.
// Therefore, we ensure that there's only ever a single thread using transformer.js, ever!
// Noone may import this file!
// Only piscina may use it to create a single thread.
import { getSentenceEmbeddingCachePath, modelPath, getImageEmbeddingCachePath } from "../paths.js";
// Including this from multiple threads causes crashes sometimes.
import { pipeline, env, FeatureExtractionPipeline, ImageFeatureExtractionPipeline } from "@huggingface/transformers";
import * as crypto from "crypto";
import * as fs from "fs";

// Don't recreate the pipeline all the time.
let sentenceExtractor: FeatureExtractionPipeline | undefined = undefined;
let imageExtractor: ImageFeatureExtractionPipeline | undefined = undefined;

// You may only run one of these at any time.
export async function embedSentences(sentences: string[]): Promise<number[][]> {
    // We don't need to cache the cache in memory because we don't run this function more than once.
    let cache: { [key: string]: number[][] } = {};
    if (fs.existsSync(getSentenceEmbeddingCachePath())) {
        const cacheFile = await fs.promises.readFile(getSentenceEmbeddingCachePath());
        cache = JSON.parse(cacheFile.toString());
    }
    const hash = crypto.hash("md5", JSON.stringify(sentences));
    if (cache[hash] != undefined) {
        console.log(`Using cache for sentence embedding ${hash}`);
        return cache[hash];
    }
    console.log(`Embedding sentences ${hash}.`);

    if (sentenceExtractor == undefined) {
        env.localModelPath = modelPath;
        // We loda the model from the internet in the CI pipeline but use the local one on the dev machine.
        // env.allowRemoteModels = false;
        sentenceExtractor = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2", { dtype: "fp32" });
    }
    const output = await sentenceExtractor(sentences, { pooling: "mean", normalize: false });
    const [n, dim] = output.dims as [number, number];
    const outputArray = Array.from({ length: n }, (_, i) =>
        output.data.slice(i * dim, (i + 1) * dim)) as Float32Array[];

    cache[hash] = outputArray.map(f => Array.from(f));
    await fs.promises.writeFile(getSentenceEmbeddingCachePath(), JSON.stringify(cache, null, 4));
    return cache[hash];
}

let embedImageCache: { [key: string]: number[] } | undefined = undefined;

// You may only run one of these at any time.
export async function embedImage(inputPath: string): Promise<number[]> {
    // Don't load the json file every time.
    // So, yes, we cache the cache.
    if (embedImageCache == undefined) {
        if (fs.existsSync(getImageEmbeddingCachePath())) {
            const cacheFile = await fs.promises.readFile(getImageEmbeddingCachePath());
            embedImageCache = JSON.parse(cacheFile.toString()) as { [key: string]: number[] };
        } else {
            embedImageCache = {};
        }
    }
    if (embedImageCache[inputPath] != undefined) {
        console.log(`Using cache for image embedding ${inputPath}`);
        return embedImageCache[inputPath];
    }
    console.log(`Embedding image ${inputPath}`);

    if (imageExtractor == undefined) {
        env.localModelPath = modelPath;
        // We loda the model from the internet in the CI pipeline but use the local one on the dev machine.
        // env.allowRemoteModels = false;
        imageExtractor = await pipeline("image-feature-extraction", "Xenova/clip-vit-base-patch32", { dtype: "fp32" });
    }
    const output = await imageExtractor(inputPath);
    const outputArray = output.data as Float32Array;

    embedImageCache[inputPath] = Array.from(outputArray);
    await fs.promises.writeFile(getImageEmbeddingCachePath(), JSON.stringify(embedImageCache, null, 4));
    return embedImageCache[inputPath];
}
