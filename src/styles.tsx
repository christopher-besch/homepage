import { createStyles, getStyleSource } from "./paths.js";
import * as fs from "fs";

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
    const dir = createStyles();
    for (const [dest, sources] of Object.entries(sourceMap)) {
        const destPath = `${dir}/${dest}`;
        // TODO: keep fd open
        fs.closeSync(fs.openSync(destPath, 'w'));
        for (const source of sources) {
            const sourcePath = getStyleSource(source);
            fs.appendFileSync(destPath, `\n/* start of ${source} */\n`);
            fs.appendFileSync(destPath, fs.readFileSync(sourcePath));
            fs.appendFileSync(destPath, `\n/* end of ${source} */\n`);
        }
    }
}
