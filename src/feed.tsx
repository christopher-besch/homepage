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

import { Feed } from "feed";
import type { Article } from "./articles.js";
import { createRssFeedDeployPath, fullFaviconLoadPath, getFullLoadPath, homepageURL } from "./paths.js";
import * as fs from "fs";
import { getDefaultExportedImage } from "./components/image.js";

export async function createFeed(articles: Article[]): Promise<void> {
    console.log("Building feed.");
    const chrisAuthor = {
        name: "Christopher Besch",
        email: "mail@chris-besch.com",
        link: homepageURL,
    };

    const feed = new Feed({
        title: "Chris' Homepage",
        description: "Christopher Besch's Homepage about Software, Articles and Photography",
        id: homepageURL,
        link: homepageURL,
        // optional, used only in RSS 2.0, possible values: http://www.w3.org/TR/REC-html40/struct/dirlang.html#langcodes
        language: "en",
        // image: "http://example.com/image.png",
        favicon: fullFaviconLoadPath,
        copyright: "All rights reserved 2025, Christopher Besch",
        // feedLinks: {
        //     json: "https://example.com/json",
        //     atom: "https://example.com/atom"
        // },
        author: chrisAuthor
    });
    await Promise.all(articles.filter(a => a.listed).sort((a, b) => b.date!.getTime() - a.date!.getTime()).map(async a => {
        if (a.banner == undefined) {
            throw new Error("listed article without banner");
        }
        if (a.date == undefined) {
            throw new Error("listed article without date");
        }

        const exportedImage = await getDefaultExportedImage({ inputPath: a.banner, lazy: false });
        const sizes = exportedImage.sizes.filter(s => s.width == 800);
        if (sizes.length != 1) {
            throw new Error();
        }

        feed.addItem({
            title: a.title,
            id: a.link,
            link: a.link,
            description: a.description,
            // content: post.content,
            author: [
                chrisAuthor
            ],
            contributor: [
                chrisAuthor
            ],
            date: a.date,
            image: getFullLoadPath(sizes[0]!.loadPath),
        });
    }));

    fs.promises.writeFile(createRssFeedDeployPath(), feed.rss2());
}
