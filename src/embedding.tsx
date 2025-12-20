export interface Embeddable {
    embedding: number[],
    listed: boolean,
};

function cosineSimilarity(a: number[], b: number[]): number {
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
