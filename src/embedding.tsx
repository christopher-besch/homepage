import { getSentenceEmbeddingCachePath, modelPath, getImageEmbeddingCachePath } from "./paths.js";
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
    if (fs.existsSync(getSentenceEmbeddingCachePath())) {
        const cacheFile = await fs.promises.readFile(getSentenceEmbeddingCachePath());
        cache = JSON.parse(cacheFile.toString());
    }
    const hash = crypto.hash("md5", JSON.stringify(sentences));
    if (cache[hash] != undefined) {
        console.log(`Using cache for sentence embedding ${hash}`);
        // TODO: this doesn't work
        return cache[hash];
    }
    console.log(`Embedding sentences ${hash}.`);

    env.localModelPath = modelPath;
    env.allowRemoteModels = false;
    const extractor = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2", { dtype: "fp32", local_files_only: true });
    const output = await extractor(sentences, { pooling: "mean", normalize: false });
    const [n, dim] = output.dims as [number, number];
    const outputArray = Array.from({ length: n }, (_, i) =>
        output.data.slice(i * dim, (i + 1) * dim)) as Float32Array[];

    cache[hash] = outputArray;
    await fs.promises.writeFile(getSentenceEmbeddingCachePath(), JSON.stringify(cache, null, 4));
    return outputArray;
}

let embedImageCache: { [key: string]: Float32Array } | undefined = undefined;

// You may only run one of these at any time.
export async function embedImage(inputPath: string): Promise<Float32Array> {
    // Don't load the json file every time.
    // So, yes, we cache the cache.
    if (embedImageCache == undefined) {
        if (fs.existsSync(getImageEmbeddingCachePath())) {
            const cacheFile = await fs.promises.readFile(getImageEmbeddingCachePath());
            embedImageCache = JSON.parse(cacheFile.toString()) as { [key: string]: Float32Array };
        } else {
            embedImageCache = {};
        }
    }
    if (embedImageCache[inputPath] != undefined) {
        console.log(`Using cache for image embedding ${inputPath}`);
        // TODO: this doesn't work
        return embedImageCache[inputPath];
    }
    console.log(`Embedding image ${inputPath}`);

    env.localModelPath = modelPath;
    env.allowRemoteModels = false;
    const extractor = await pipeline("image-feature-extraction", "Xenova/clip-vit-base-patch32", { dtype: "fp32", local_files_only: true });
    const output = await extractor(inputPath);
    const outputArray = output.data as Float32Array;

    embedImageCache[inputPath] = outputArray;
    await fs.promises.writeFile(getImageEmbeddingCachePath(), JSON.stringify(embedImageCache, null, 4));
    return outputArray;
}

function cosineSimilarity(a: Float32Array, b: Float32Array): number {
    if (a.length != b.length) {
        throw new Error("Arrays must have the same length");
    }

    let dot = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < a.length; i++) {
        const x = a[i]!;
        const y = b[i]!;
        dot += x * y;
        normA += x * x;
        normB += y * y;
    }

    const denom = Math.sqrt(normA) * Math.sqrt(normB);
    return denom == 0 ? 0 : dot / denom;
}

// Get neighbouring embeddables that are as close as possible and antiNeighbours articles that are as different as possible.
export function getNearestListedNeighbours<T extends Embeddable>(idx: number, neighbours: number, antiNeighbours: number, embeddables: T[]): T[] {
    let processedEmbeddable = [...embeddables];
    // Skip the original embeddable.
    processedEmbeddable.splice(idx, 1);
    processedEmbeddable = processedEmbeddable
        .filter(a => a.listed)
        .sort((a, b) => cosineSimilarity(embeddables[idx]!.embedding, b.embedding) - cosineSimilarity(embeddables[idx]!.embedding, a.embedding));
    processedEmbeddable.splice(neighbours, processedEmbeddable.length - neighbours - antiNeighbours);
    return processedEmbeddable;
}
