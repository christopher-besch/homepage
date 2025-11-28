import sharp from "sharp";
import { createImageDeployPath, createImageLoadPath } from "./paths.js";
import * as fs from "fs";
import * as crypto from "crypto";

export class ImageSize {
    width: number;
    height: number;
    loadPath: string;

    constructor(width: number, height: number, loadPath: string) {
        this.width = width;
        this.height = height;
        this.loadPath = loadPath;
    }
};

// Return a map from width to static resource path of the image with that width.
// widths shall contain all wished for widths.
// If the image is smaller than any of them, that width won't be used.
export async function convertImage(props: { input: string, widths: number[] }): Promise<ImageSize[]> {
    const file = await fs.promises.readFile(props.input);
    const hash = crypto.hash("md5", file);
    const image = sharp(file).autoOrient().webp({ quality: 80, effort: 6 });
    const metadata = await image.metadata();

    let actualWidths = props.widths.filter((width) => { return width <= metadata.width; });
    if (actualWidths.length == 0) {
        // None of the target widths are small enough.
        // This is a tiny image.
        actualWidths.push(metadata.width);
    }

    let sizes: ImageSize[] = [];
    for (const width of actualWidths) {
        sizes.push(
            new ImageSize(width, Math.round(width / metadata.width * metadata.height), createImageLoadPath(hash, width))
        );

        const deployPath = createImageDeployPath(hash, width);
        // If the path already exists, the hashes match and we can use the cache.
        if (!fs.existsSync(deployPath)) {
            // We don't need to await this.
            // This can happen in the background
            image.clone().resize(width, null).toFile(deployPath);
        }
    };
    return sizes;
}
