import * as fs from "fs";
import readingTime from "reading-time";
import matter from "gray-matter";
import Markdown from "./components/markdown.js";
import path from "path";

export interface Article {
    dirPath: string,
    title: string,
    description: string,
    banner?: string,
    hero?: {
        inputPath: string,
        horizontalPosition: number,
        verticalPosition: number,
    },
    slug: string,
    date: string,
    listed: boolean,
    readingTimeMinutes: number,
    markdown: string,
    html: React.ReactNode,
};

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

export async function prepareArticle(mdPath: string): Promise<Article> {
    const dirPath = path.dirname(mdPath);
    const file = await fs.promises.readFile(mdPath, "utf8");
    const { content: md, data: frontMatter } = matter(file);

    const banner_name = assertIsOptionalString(frontMatter['banner']);
    const hero_name = assertIsOptionalString(frontMatter['hero']);

    return {
        dirPath: dirPath,
        title: assertIsString(frontMatter['title']),
        description: assertIsString(frontMatter['description']),
        banner: banner_name != undefined ? path.join(dirPath, banner_name) : undefined,
        hero: hero_name != undefined ? {
            inputPath: path.join(dirPath, hero_name),
            horizontalPosition: assertIsNumber(frontMatter['hero_horizontal_position']),
            verticalPosition: assertIsNumber(frontMatter['hero_vertical_position']),
        } : undefined,
        slug: assertIsString(frontMatter['slug']),
        // TODO: better type
        date: assertIsString(frontMatter['date']),
        listed: assertIsBoolean(frontMatter['listed']),
        readingTimeMinutes: readingTime(md).minutes,
        markdown: md,
        html: <Markdown content={md} dirPath={dirPath} />,
    };
}

