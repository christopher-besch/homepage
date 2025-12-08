import { sentenceEmbeddingCachePath, modelPath, imageEmbeddingCachePath } from "./paths.js";
import { pipeline, env } from "@huggingface/transformers";
import * as crypto from "crypto";
import * as fs from "fs";

export interface Embeddable {
    embedding: Float32Array,
    listed: boolean,
};

// You may only run one of these at any time.
export async function embedSentences(sentences: string[]): Promise<Float32Array[]> {
    let cache: { [key: string]: Float32Array[] } = {};
    if (fs.existsSync(sentenceEmbeddingCachePath)) {
        const cacheFile = await fs.promises.readFile(sentenceEmbeddingCachePath);
        cache = JSON.parse(cacheFile.toString());
    }
    const hash = crypto.hash("md5", JSON.stringify(sentences));
    if (cache[hash] != undefined) {
        console.log(`Using cache for sentece embedding ${hash}.`);
        return cache[hash];
    }
    console.log(`Embedding sentences ${hash}.`);

    env.localModelPath = modelPath;
    env.allowRemoteModels = false;
    const extractor = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2", { dtype: "fp32", local_files_only: true });
    const output = await extractor(sentences, { pooling: "mean", normalize: true });
    const [n, dim] = output.dims as [number, number];
    const outputArray = Array.from({ length: n }, (_, i) =>
        output.data.slice(i * dim, (i + 1) * dim)) as Float32Array[];

    cache[hash] = outputArray;
    await fs.promises.writeFile(sentenceEmbeddingCachePath, JSON.stringify(cache, null, 4));
    return outputArray;
}

// You may only run one of these at any time.
export async function embedImage(inputPath: string): Promise<Float32Array> {
    let cache: { [key: string]: Float32Array } = {};
    if (fs.existsSync(imageEmbeddingCachePath)) {
        const cacheFile = await fs.promises.readFile(imageEmbeddingCachePath);
        cache = JSON.parse(cacheFile.toString());
    }
    if (cache[inputPath] != undefined) {
        console.log(`Using cache for image embedding ${inputPath}.`);
        return cache[inputPath];
    }
    console.log(`Embedding image ${inputPath}.`);

    env.localModelPath = modelPath;
    env.allowRemoteModels = false;
    const extractor = await pipeline("image-feature-extraction", "Xenova/clip-vit-base-patch32", { dtype: "fp32", local_files_only: true });
    // TODO: normalize?
    const output = await extractor(inputPath);
    const outputArray = output.data as Float32Array;

    cache[inputPath] = outputArray;
    await fs.promises.writeFile(imageEmbeddingCachePath, JSON.stringify(cache, null, 4));
    return outputArray;
}

function dotProduct(a: Float32Array, b: Float32Array): number {
    let dot = 0;
    for (let i = 0; i < a.length; i++) {
        const x = a[i]!;
        const y = b[i]!;
        dot += x * y;
    }
    return dot;
}

// Get neighbouring embeddables that are as close as possible and antiNeighbours articles that are as different as possible.
export function getNearestListedNeighbours<T extends Embeddable>(idx: number, neighbours: number, antiNeighbours: number, embeddables: T[]): T[] {
    let processedEmbeddable = [...embeddables];
    // Skip the original embeddable.
    processedEmbeddable.splice(idx, 1);
    processedEmbeddable = processedEmbeddable
        .filter(a => a.listed)
        .sort((a, b) => dotProduct(embeddables[idx]!.embedding, b.embedding) - dotProduct(embeddables[idx]!.embedding, a.embedding));
    processedEmbeddable.splice(neighbours, processedEmbeddable.length - neighbours - antiNeighbours);
    return processedEmbeddable;
}
