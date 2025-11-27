import sharp from "sharp";
import { createImageDeployPath, createImageLoadPath } from "./paths.js";
import * as fs from "fs";
import * as crypto from "crypto";

// Return a map from width to static resource path of the image with that width.
// widths shall contain all wished for widths.
// If the image is smaller than any of them, that width won't be used.
export async function convertImage(props: { input: string, widths: number[] }): Promise<Map<number, string>> {
    const file = await fs.promises.readFile(props.input);
    const hash = crypto.hash("md5", file);
    const image = sharp(file).autoOrient().webp({ quality: 80, effort: 6 });
    const metadata = await image.metadata();

    let actual_widths = props.widths.filter((width) => { return width <= metadata.width; });
    if (actual_widths.length == 0) {
        // None of the target widths are small enough.
        // This is a tiny image.
        actual_widths.push(metadata.width);
    }

    let map = new Map<number, string>();
    actual_widths.forEach((width) => {
        map.set(width, createImageLoadPath(hash, width));
        // We don't need to await this.
        image.clone().resize(width, undefined).toFile(createImageDeployPath(hash, width));
    });
    return map;
}
