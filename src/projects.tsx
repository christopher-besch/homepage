import * as fs from "fs";
import matter from "gray-matter";
import path from "path";
import type { CardListable } from "./components/cards_list.js";
import { assertIsBoolean, assertIsArrayOfStrings, assertIsNumber, assertIsOptionalString, assertIsString } from "./conversion.js";
import { getProjectsSrcPaths } from "./paths.js";

export interface Project extends CardListable {
    dirPath: string,
    title: string,
    description: string,
    priority: number,
    languages: string[],
    dependencies: string[],
    // required when listed
    banner?: string,
    // required when listed
    date?: Date,
    link: string,
    listed: boolean,
};

async function prepareProject(mdSrcPath: string): Promise<Project> {
    const dirPath = path.dirname(mdSrcPath);
    const file = await fs.promises.readFile(mdSrcPath, "utf8");
    const { data: frontMatter } = matter(file);

    const bannerName = assertIsOptionalString(frontMatter["banner"]);
    const dateStr = assertIsOptionalString(frontMatter["date"]);

    return {
        dirPath: dirPath,
        title: assertIsString(frontMatter["title"]),
        description: assertIsString(frontMatter["description"]),
        priority: assertIsNumber(frontMatter["priority"]),
        languages: assertIsArrayOfStrings(frontMatter["languages"]),
        dependencies: assertIsArrayOfStrings(frontMatter["dependencies"]),
        banner: bannerName != undefined ? path.join(dirPath, bannerName) : undefined,
        link: assertIsString(frontMatter["link"]),
        date: dateStr != undefined ? new Date(dateStr) : undefined,
        listed: assertIsBoolean(frontMatter["listed"]),
    };
}

export async function prepareProjects(): Promise<Project[]> {
    const projectsSrcPaths = await getProjectsSrcPaths();
    return await Promise.all(projectsSrcPaths.map(prepareProject));
}
