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
import { getArticleSrcPaths, getArticleRoute, copyArticlePDFInBG } from "./paths.js";
import type { CardListable } from "./components/cards_list.js";
import { assertIsArrayOfStrings, assertIsBoolean, assertIsNumber, assertIsOptionalString, assertIsString, htmlToPlaintext } from "./conversion.js";
import { PDFParse } from "pdf-parse";

interface UnembeddedArticle extends CardListable {
    dirPath: string,
    isPDF: boolean,
    hero?: {
        inputPath: string,
        horizontalPosition: number,
        verticalPosition: number,
    },
    reactNode?: React.ReactNode,
};

export interface Article extends UnembeddedArticle, Embeddable { };

// async function getPDFText(pdfPath: string): Promise<string> {
//     return new Promise(r => {
//         let text = "";
//         new PdfReader().parseFileItems(pdfPath, (err, item) => {
//             if (err) {
//                 throw err;
//             }
//             // Reached EOF.
//             if (item == null) {
//                 r(text);
//                 console.log(text);
//                 return;
//             }
//             if (item.text != null) {
//                 text += item.text;
//             }
//         });
//     });
// }

// Return article without embedding and plaintext string prepared for embedding the article.
async function prepareArticle(mdSrcPath: string): Promise<[UnembeddedArticle, string]> {
    const dirPath = path.dirname(mdSrcPath);
    const file = await fs.promises.readFile(mdSrcPath, "utf8");
    const { content: md, data: frontMatter } = matter(file);

    const bannerName = assertIsOptionalString(frontMatter["banner"]);
    const heroName = assertIsOptionalString(frontMatter["hero"]);
    const dateStr = assertIsOptionalString(frontMatter["date"]);
    const tags = assertIsArrayOfStrings(frontMatter["tags"]);
    const pdfName = assertIsOptionalString(frontMatter["pdf"]);
    const slug = assertIsString(frontMatter["slug"]);
    const isPDF = pdfName != undefined;
    // Always use the slug for the pdf link.
    // This makes it so that the link is always the same.
    const link = isPDF ? copyArticlePDFInBG(dirPath, slug, pdfName) :
        getArticleRoute(slug);

    // PDF articles don't have reactNode and have a different method of retrieving the plaintext.
    let reactNode: React.ReactNode | undefined = undefined;
    let plaintext = "";
    if (!isPDF) {
        reactNode = <Markdown content={md} dirPath={dirPath} />;
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
                },
                onShellError: (e) => { throw e; },
                onError: (e) => { throw e; },
            });
        }) as string;
        plaintext = htmlToPlaintext(html);
    } else {
        const parser = new PDFParse({ url: path.join(dirPath, pdfName) })
        const result = await parser.getText();
        await parser.destroy();
        plaintext = result.text.replaceAll("\n", " ");
    }

    return [{
        dirPath,
        isPDF,
        title: assertIsString(frontMatter["title"]),
        description: assertIsString(frontMatter["description"]).trim(),
        banner: bannerName != undefined ? path.join(dirPath, bannerName) : undefined,
        hero: heroName != undefined ? {
            inputPath: path.join(dirPath, heroName),
            horizontalPosition: assertIsNumber(frontMatter["hero_horizontal_position"]),
            verticalPosition: assertIsNumber(frontMatter["hero_vertical_position"]),
        } : undefined,
        link,
        date: dateStr != undefined ? new Date(dateStr) : undefined,
        tags,
        listed: assertIsBoolean(frontMatter["listed"]),
        readingTimeMinutes: readingTime(plaintext).minutes,
        reactNode,
    }, plaintext];
}

export async function prepareArticles(): Promise<Article[]> {
    const articleSrcPaths = await getArticleSrcPaths();
    const unembeddedArticles = await Promise.all(articleSrcPaths.map(prepareArticle));
    const embeddings = await embedSentencesOnPool(unembeddedArticles.map(([_, p]) => p));
    return unembeddedArticles.map(([a, _], i) => { return { ...a, embedding: embeddings[i]! }; });
}
