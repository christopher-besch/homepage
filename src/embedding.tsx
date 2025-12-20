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
