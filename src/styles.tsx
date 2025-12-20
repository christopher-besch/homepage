import { transform } from "lightningcss";
import { createStyleDeployPath, getStyleSourcePath } from "./paths.js";
import * as fs from "fs";

// This is just a little bit of manual tree-shaking.
const sourceMap = new Map<string, string[]>();
// We need these styles everywhere.
sourceMap.set("always.css", [
    getStyleSourcePath("reset.css"),
    getStyleSourcePath("colors.css"),
    getStyleSourcePath("fonts.css"),
    getStyleSourcePath("layout.module.css"),
    getStyleSourcePath("image.module.css"),
    getStyleSourcePath("title.module.css"),
    // This might not strictly be needed on all pages but kinda is.
    getStyleSourcePath("cards_list.module.css"),
    getStyleSourcePath("button.module.css"),
]);
sourceMap.set("default.css", [
    getStyleSourcePath("index_page.module.css"),
    getStyleSourcePath("photo_list.module.css"),
    getStyleSourcePath("photo_page.module.css"),
]);
sourceMap.set("article.css", [
    getStyleSourcePath("article_page.module.css"),
    getStyleSourcePath("markdown.module.css"),
    getStyleSourcePath("half_element.module.css"),
    getStyleSourcePath("half_image.module.css"),
    getStyleSourcePath("half_video.module.css"),
    // This isn't really needed in many articles but the about page uses articles.css, so...
    getStyleSourcePath("about_page.module.css"),
    "./node_modules/katex/dist/katex.min.css",
    "./node_modules/@wooorm/starry-night/style/core.css",
    "./node_modules/@wooorm/starry-night/style/both.css",
]);

export async function buildStyles() {
    await Promise.all(sourceMap.entries().map(async ([deployName, sourcePaths]) => {
        console.log("start:", deployName);
        const destPath = createStyleDeployPath(deployName);
        const sources = await Promise.all(sourcePaths.map(s => fs.promises.readFile(s)));
        const { code } = transform({
            filename: destPath,
            code: new Uint8Array(sources.flatMap(s => Array.from(new Uint8Array(s)))),
            minify: true,
            sourceMap: false,
        });
        await fs.promises.writeFile(destPath, code).catch();
    }));
}
