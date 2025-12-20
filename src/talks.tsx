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
import matter from "gray-matter";
import path from "path";
import type { CardListable } from "./components/cards_list.js";
import { assertIsArrayOfStrings, assertIsBoolean, assertIsOptionalString, assertIsString } from "./conversion.js";
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

    const bannerName = assertIsOptionalString(frontMatter["banner"]);
    const dateStr = assertIsOptionalString(frontMatter["date"]);

    return {
        dirPath: dirPath,
        title: assertIsString(frontMatter["title"]),
        description: assertIsString(frontMatter["description"]),
        banner: bannerName != undefined ? path.join(dirPath, bannerName) : undefined,
        link: assertIsString(frontMatter["link"]),
        tags: assertIsArrayOfStrings(frontMatter["tags"]),
        date: dateStr != undefined ? new Date(dateStr) : undefined,
        listed: assertIsBoolean(frontMatter["listed"]),
    };
}

export async function prepareTalks(): Promise<Talk[]> {
    const talkSrcPaths = await getTalksSrcPaths();
    return await Promise.all(talkSrcPaths.map(prepareTalk));
}
