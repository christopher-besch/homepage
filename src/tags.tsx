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

// Return tags sorted by how many times they appear combined with the amount of times they appear.
export function sortTags(tags: string[]): [string, number][] {
    let tagsMap = new Map<string, number>();
    for (const tag of tags) {
        if (tagsMap.has(tag)) {
            tagsMap.set(tag, tagsMap.get(tag)! + 1);
        } else {
            tagsMap.set(tag, 1);
        }
    }
    return tagsMap.entries().toArray().sort(([_a, a], [_b, b]) => b - a);
}
