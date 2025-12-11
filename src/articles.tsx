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
import { assertIsBoolean, assertIsNumber, assertIsOptionalString, assertIsString, htmlToPlaintext } from "./conversion.js";

interface UnembeddedArticle extends CardListable {
    dirPath: string,
    title: string,
    description: string,
    // required when listed
    banner?: string,
    hero?: {
        inputPath: string,
        horizontalPosition: number,
        verticalPosition: number,
    },
    link: string,
    // required when listed
    date?: Date,
    listed: boolean,
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

    const reactNode = <Markdown content={md} dirPath={dirPath} />;
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
        description: assertIsString(frontMatter["description"]),
        banner: bannerName != undefined ? path.join(dirPath, bannerName) : undefined,
        hero: heroName != undefined ? {
            inputPath: path.join(dirPath, heroName),
            horizontalPosition: assertIsNumber(frontMatter["hero_horizontal_position"]),
            verticalPosition: assertIsNumber(frontMatter["hero_vertical_position"]),
        } : undefined,
        link: getArticleRoute(assertIsString(frontMatter["slug"])),
        date: dateStr != undefined ? new Date(dateStr) : undefined,
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
