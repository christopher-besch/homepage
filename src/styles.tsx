import { createStyleDeployPath, getStyleSourcePath } from "./paths.js";
import * as fs from "fs";

// This is just a little bit of manual tree-shaking.
// TODO: maybe load more than one style sheet for each type of page.
const sourceMap = new Map<string, string[]>();
// We need these styles everywhere.
sourceMap.set("always.css", [
    "reset.css",
    "colors.css",
    "fonts.css",
    "layout.module.css",
    // This might not strictly be needed on all pages but kinda is.
    "image.module.css",
]);
sourceMap.set("default.css", [
    "index.module.css",
]);
sourceMap.set("article.css", [
    "markdown.module.css",
]);

export async function buildStyles() {
    for (const [deployName, sourceNames] of sourceMap) {
        const destPath = createStyleDeployPath(deployName);
        const outFile = await fs.promises.open(destPath, "w");
        for (const sourceName of sourceNames) {
            const sourcePath = getStyleSourcePath(sourceName);
            outFile.write(`\n/* start of ${sourceName} */\n`);
            outFile.write(await fs.promises.readFile(sourcePath));
            outFile.write(`\n/* end of ${sourceName} */\n`);
        }
    }
}
