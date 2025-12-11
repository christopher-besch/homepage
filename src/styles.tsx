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
    "./node_modules/katex/dist/katex.min.css",
    "./node_modules/@wooorm/starry-night/style/core.css",
    "./node_modules/@wooorm/starry-night/style/both.css",
]);

export async function buildStyles() {
    for (const [deployName, sourcePaths] of sourceMap) {
        const destPath = createStyleDeployPath(deployName);
        const outFile = await fs.promises.open(destPath, "w");
        for (const sourcePath of sourcePaths) {
            outFile.write(`\n/* start of ${sourcePath} */\n`);
            outFile.write(await fs.promises.readFile(sourcePath));
            outFile.write(`\n/* end of ${sourcePath} */\n`);
        }
        outFile.close();
    }
}
