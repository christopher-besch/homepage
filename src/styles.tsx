import { createStyleDeployPath, getStyleSourcePath } from "./paths.js";
import * as fs from "fs";

// TODO: make this a Map
const sourceMap = {
    "default.css": [
        "colors.css",
        "index.module.css",
        "layout.module.css",
        "markdown.module.css"
    ],
    "reset.css": [
        "reset.css",
    ]
}

export function buildStyles() {
    for (const [deployName, sourceNames] of Object.entries(sourceMap)) {
        const destPath = createStyleDeployPath(deployName);
        // TODO: keep fd open
        // TODO: do this async
        fs.closeSync(fs.openSync(destPath, 'w'));
        for (const sourceName of sourceNames) {
            const sourcePath = getStyleSourcePath(sourceName);
            fs.appendFileSync(destPath, `\n/* start of ${sourceName} */\n`);
            fs.appendFileSync(destPath, fs.readFileSync(sourcePath));
            fs.appendFileSync(destPath, `\n/* end of ${sourceName} */\n`);
        }
    }
}
