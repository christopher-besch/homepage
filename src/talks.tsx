import * as fs from "fs";
import matter from "gray-matter";
import path from "path";
import type { CardListable } from "./components/cards_list.js";
import { assertIsBoolean, assertIsOptionalString, assertIsString } from "./conversion.js";
import { getTalksSrcPaths } from "./paths.js";

export interface Talk extends CardListable {
    dirPath: string,
    title: string,
    description: string,
    // required when listed
    banner?: string,
    // required when listed
    date?: Date,
    link: string,
    listed: boolean,
};

async function prepareTalk(mdSrcPath: string): Promise<Talk> {
    const dirPath = path.dirname(mdSrcPath);
    const file = await fs.promises.readFile(mdSrcPath, "utf8");
    const { data: frontMatter } = matter(file);

    const bannerName = assertIsOptionalString(frontMatter['banner']);
    const dateStr = assertIsOptionalString(frontMatter['date']);

    return {
        dirPath: dirPath,
        title: assertIsString(frontMatter['title']),
        description: assertIsString(frontMatter['description']),
        banner: bannerName != undefined ? path.join(dirPath, bannerName) : undefined,
        link: assertIsString(frontMatter['link']),
        date: dateStr != undefined ? new Date(dateStr) : undefined,
        listed: assertIsBoolean(frontMatter['listed']),
    };
}

export async function prepareTalks(): Promise<Talk[]> {
    const talkSrcPaths = await getTalksSrcPaths();
    return await Promise.all(talkSrcPaths.map(prepareTalk));
}
