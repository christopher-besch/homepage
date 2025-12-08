import * as fs from "fs";
import readingTime from "reading-time";
import matter from "gray-matter";
import Markdown from "./components/markdown.js";
import { renderToPipeableStream } from "react-dom/server";
import path from "path";
import { PassThrough } from "stream";
import { decode } from "html-entities";
import { type Embeddable } from "./embedding.js";
import { embedSentencesOnPool } from "./worker/worker_pool.js";

interface UnembeddedArticle {
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
    slug: string,
    // required when listed
    date?: Date,
    listed: boolean,
    readingTimeMinutes: number,
    reactNode: React.ReactNode,
};

export interface Article extends UnembeddedArticle, Embeddable { };

function assertIsString(input: any): string {
    if (typeof input != "string") {
        throw new Error(`${input} is no string but ${typeof input}`);
    }
    return input;
}

function assertIsOptionalString(input: any): string | undefined {
    if (typeof input != "string" && typeof input != "undefined") {
        throw new Error(`${input} is no string or undefined but ${typeof input}`);
    }
    return input;
}

function assertIsNumber(input: any): number {
    if (typeof input != "number") {
        throw new Error(`${input} is no number but ${typeof input}`);
    }
    return input;
}

function assertIsBoolean(input: any): boolean {
    if (typeof input != "boolean") {
        throw new Error(`${input} is no boolean but ${typeof input}`);
    }
    return input;
}

function htmlToPlaintext(html: string): string {
    return decode(html.replace(/<[^>]+>/g, '')).replace(/\s+/g, ' ');
}

// Return article without embedding and plaintext string prepared for embedding the article.
async function prepareArticle(mdPath: string): Promise<[UnembeddedArticle, string]> {
    const dirPath = path.dirname(mdPath);
    const file = await fs.promises.readFile(mdPath, "utf8");
    const { content: md, data: frontMatter } = matter(file);

    const bannerName = assertIsOptionalString(frontMatter['banner']);
    const heroName = assertIsOptionalString(frontMatter['hero']);
    const dateStr = assertIsOptionalString(frontMatter['date']);

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
        title: assertIsString(frontMatter['title']),
        description: assertIsString(frontMatter['description']),
        banner: bannerName != undefined ? path.join(dirPath, bannerName) : undefined,
        hero: heroName != undefined ? {
            inputPath: path.join(dirPath, heroName),
            horizontalPosition: assertIsNumber(frontMatter['hero_horizontal_position']),
            verticalPosition: assertIsNumber(frontMatter['hero_vertical_position']),
        } : undefined,
        slug: assertIsString(frontMatter['slug']),
        date: dateStr != undefined ? new Date(dateStr) : undefined,
        listed: assertIsBoolean(frontMatter['listed']),
        readingTimeMinutes: readingTime(md).minutes,
        reactNode: reactNode,
    }, plaintext];
}

export async function prepareArticles(articlePaths: string[]): Promise<Article[]> {
    const unembeddedArticles = await Promise.all(articlePaths.map(prepareArticle));
    const embeddings = await embedSentencesOnPool(unembeddedArticles.map(([_, p]) => p));
    return unembeddedArticles.map(([a, _], i) => { return { ...a, embedding: embeddings[i]! }; });
}
