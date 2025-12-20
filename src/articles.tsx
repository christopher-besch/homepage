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

import * as fs from "fs";
import readingTime from "reading-time";
import matter from "gray-matter";
import Markdown from "./components/markdown.js";
import { renderToPipeableStream } from "react-dom/server";
import path from "path";
import { PassThrough } from "stream";
import { type Embeddable } from "./embedding.js";
import { embedSentencesOnPool } from "./worker/worker_pool.js";
import { getArticleSrcPaths, getArticleRoute } from "./paths.js";
import type { CardListable } from "./components/cards_list.js";
import { assertIsArrayOfStrings, assertIsBoolean, assertIsNumber, assertIsOptionalString, assertIsString, htmlToPlaintext } from "./conversion.js";

interface UnembeddedArticle extends CardListable {
    dirPath: string,
    hero?: {
        inputPath: string,
        horizontalPosition: number,
        verticalPosition: number,
    },
    readingTimeMinutes: number,
    reactNode: React.ReactNode,
};

export interface Article extends UnembeddedArticle, Embeddable { };

// Return article without embedding and plaintext string prepared for embedding the article.
async function prepareArticle(mdSrcPath: string): Promise<[UnembeddedArticle, string]> {
    const dirPath = path.dirname(mdSrcPath);
    const file = await fs.promises.readFile(mdSrcPath, "utf8");
    const { content: md, data: frontMatter } = matter(file);

    const bannerName = assertIsOptionalString(frontMatter["banner"]);
    const heroName = assertIsOptionalString(frontMatter["hero"]);
    const dateStr = assertIsOptionalString(frontMatter["date"]);
    const tags = assertIsArrayOfStrings(frontMatter["tags"]);

    const reactNode = <Markdown content={md} dirPath={dirPath} />;
    // We need to render the html here again because we need the plaintext for the readtime and sentence embedding.
    const html = await new Promise(r => {
        let out = renderToPipeableStream(reactNode, {
            onAllReady: () => {
                const stream = new PassThrough();
                let html = "";
                stream.on("data", chunk => {
                    html += chunk.toString();
                });
                stream.on("end", () => {
                    r(html);
                });
                out.pipe(stream);
            }
        });
    }) as string;

    const plaintext = htmlToPlaintext(html);

    return [{
        dirPath: dirPath,
        title: assertIsString(frontMatter["title"]),
        description: assertIsString(frontMatter["description"]).trim(),
        banner: bannerName != undefined ? path.join(dirPath, bannerName) : undefined,
        hero: heroName != undefined ? {
            inputPath: path.join(dirPath, heroName),
            horizontalPosition: assertIsNumber(frontMatter["hero_horizontal_position"]),
            verticalPosition: assertIsNumber(frontMatter["hero_vertical_position"]),
        } : undefined,
        link: getArticleRoute(assertIsString(frontMatter["slug"])),
        date: dateStr != undefined ? new Date(dateStr) : undefined,
        tags: tags,
        listed: assertIsBoolean(frontMatter["listed"]),
        readingTimeMinutes: readingTime(plaintext).minutes,
        reactNode: reactNode,
    }, plaintext];
}

export async function prepareArticles(): Promise<Article[]> {
    const articleSrcPaths = await getArticleSrcPaths();
    const unembeddedArticles = await Promise.all(articleSrcPaths.map(prepareArticle));
    const embeddings = await embedSentencesOnPool(unembeddedArticles.map(([_, p]) => p));
    return unembeddedArticles.map(([a, _], i) => { return { ...a, embedding: embeddings[i]! }; });
}
