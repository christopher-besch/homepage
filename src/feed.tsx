import { Feed } from "feed";
import type { Article } from "./article.js";
import { createRssFeedDeployPath, fullFaviconLoadPath, getFullArticleLoadPath, getFullLoadPath, homepageURL } from "./paths.js";
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
            id: getFullArticleLoadPath(a.slug),
            link: getFullArticleLoadPath(a.slug),
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
