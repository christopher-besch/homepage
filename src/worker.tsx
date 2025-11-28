import sharp from "sharp";
import { createImageDeployPath, createImageLoadPath } from "./paths.js";
import * as fs from "fs";
import * as crypto from "crypto";
import type React from "react";

export class ImageSize {
    width: number;
    height: number;
    loadPath: string;
    lqip: React.CSSProperties;

    constructor(width: number, height: number, loadPath: string, lqip: React.CSSProperties) {
        this.width = width;
        this.height = height;
        this.loadPath = loadPath;
        this.lqip = lqip;
    }
};

async function getLqip(image: sharp.Sharp): Promise<React.CSSProperties> {
    function colorToCss(r: number, g: number, b: number, a: number): string {
        if (a === 255) {
            return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
        } else {
            const af = (a / 255).toFixed(3);
            return `rgba(${r}, ${g}, ${b}, ${af})`;
        }
    }
    const width = 3;
    const height = 3;
    const { data, info } = await image.resize(width, height, { fit: "fill" }).raw().ensureAlpha().toBuffer({ resolveWithObject: true });
    if (info.channels != 4) {
        throw new Error("channels is not 4");
    }
    if (data.length != width * height * 4) {
        throw new Error("number of pixels doesn't match");
    }

    console.log(data.length)
    const pixels: string[] = [];
    for (let i = 0; i < width * height; i++) {
        const base = i * 4;
        const r = data[base + 0]!;
        const g = data[base + 1]!;
        const b = data[base + 2]!;
        const a = data[base + 3]!;
        pixels.push(colorToCss(r, g, b, a));
    }

    const singleImage = await image.resize(1, 1, { fit: "fill" }).raw().ensureAlpha().toBuffer({ resolveWithObject: true });
    const background = colorToCss(singleImage.data[0]!, singleImage.data[1]!, singleImage.data[2]!, singleImage.data[3]!);

    const gradients = [
        `radial-gradient(50% 50% at 25% 25%, ${pixels[0]}, transparent)`,
        `radial-gradient(50% 50% at 50% 25%, ${pixels[1]}, transparent)`,
        `radial-gradient(50% 50% at 75% 25%, ${pixels[2]}, transparent)`,

        `radial-gradient(50% 50% at 25% 50%, ${pixels[3]}, transparent)`,
        `radial-gradient(50% 50% at 50% 50%, ${pixels[4]}, transparent)`,
        `radial-gradient(50% 50% at 75% 50%, ${pixels[5]}, transparent)`,

        `radial-gradient(50% 50% at 25% 75%, ${pixels[6]}, transparent)`,
        `radial-gradient(50% 50% at 50% 75%, ${pixels[7]}, transparent)`,
        `radial-gradient(50% 50% at 75% 75%, ${pixels[8]}, transparent)`,
        `linear-gradient(${background})`,
    ];

    return {
        backgroundImage: gradients.join(","),
        backgroundPosition: "0 0, 0 100%",
        backgroundSize: "100% 100%",
        backgroundRepeat: "no-repeat",
    };
}

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
    const lqip = await getLqip(image.clone());

    let sizes: ImageSize[] = [];
    for (const width of actualWidths) {
        sizes.push(
            // For now we set the same lqip for all sizes and only the lqip for the smallest size later.
            new ImageSize(width, Math.round(width / metadata.width * metadata.height), createImageLoadPath(hash, width), lqip)
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
