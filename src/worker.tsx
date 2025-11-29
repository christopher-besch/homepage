import sharp from "sharp";
import { createImageDeployPath, createImageLoadPath } from "./paths.js";
import * as fs from "fs";
import * as crypto from "crypto";
import type React from "react";

function colorToCss(r: number, g: number, b: number, a: number): string {
    if (a === 255) {
        return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
    } else {
        const af = (a / 255).toFixed(3);
        return `rgba(${r}, ${g}, ${b}, ${af})`;
    }
}

// Create a blurry background for the img tag so that there's something while the picture hasn't arrived yet.
// This function doesn't change the image but creates its own clone.
async function getLqip(image: sharp.Sharp, width: number, height: number): Promise<React.CSSProperties> {
    const clonedImage = image.clone();
    const { data, info } = await clonedImage.resize(width, height, { fit: "fill" }).raw().ensureAlpha().toBuffer({ resolveWithObject: true });
    if (info.channels != 4) {
        throw new Error("channels is not 4");
    }
    if (data.length != width * height * 4) {
        throw new Error("number of pixels doesn't match");
    }

    const pixels: string[] = [];
    for (let i = 0; i < width * height; i++) {
        const base = i * 4;
        const r = data[base + 0]!;
        const g = data[base + 1]!;
        const b = data[base + 2]!;
        const a = data[base + 3]!;
        pixels.push(colorToCss(r, g, b, a));
    }

    const singleImage = await clonedImage.resize(1, 1, { fit: "fill" }).raw().ensureAlpha().toBuffer({ resolveWithObject: true });
    const background = colorToCss(singleImage.data[0]!, singleImage.data[1]!, singleImage.data[2]!, singleImage.data[3]!);

    // Somewhat decrease the elipse size with higher width and height.
    const elipseWidth = Math.round(200 / width);
    const elipseHeight = Math.round(200 / height);
    let gradients: string[] = [];
    for (let y = 0; y < height; ++y) {
        for (let x = 0; x < width; ++x) {
            // One gradient for each pixel.
            const i = y * width + x;
            // Where should the center of the gradient be?
            const percentX = Math.round(100 / (width + 1) * (x + 1));
            const percentY = Math.round(100 / (height + 1) * (y + 1));
            gradients.push(`radial-gradient(${elipseWidth}% ${elipseHeight}% at ${percentX}% ${percentY}%, ${pixels[i]}, transparent)`);
        }
    }
    gradients.push(`linear-gradient(${background})`);

    return {
        backgroundImage: gradients.join(","),
        backgroundPosition: "0 0, 0 100%",
        backgroundSize: "100% 100%",
        backgroundRepeat: "no-repeat",
    };
}

// All the parameters needed to convert an image.
export interface ConvertImageProps {
    // the input image's path
    input: string,
    // the requested widths of the output images
    widths: number[],
    // the width of the low quality image preview
    lqipWidth: number,
    // the height of the low quality image preview
    lqipHeight: number,
    // When we use object-fit: cover and we use a landscape photo on a portrait device, we might want to create a separate image for this purpose.
    // The other direction (using a portrait image on a landscape device) would be possible, too, but isn't implemented.
    portraitVersion?: {
        // the first value in object-position
        objectFitPositionH: number,
        // the aspect ratio of the cropped image
        aspectRatio: number,
        // the requested widths of the output images
        widths: number[],
    }
};

// Represent one size of the image.
interface ImageSize {
    // The width in pixels of this size.
    width: number;
    // The height in pixels of this size.
    height: number;
    loadPath: string;
    lqip: React.CSSProperties;
};

// This function doesn't change the image but creates its own clone.
function resizeImage(
    hash: string,
    image: sharp.Sharp,
    originalWidth: number,
    originalHeight: number,
    width: number,
    lqip: React.CSSProperties
): ImageSize {
    const deployPath = createImageDeployPath(hash, width);
    // If the path already exists, the hashes match and we can use the cache.
    if (!fs.existsSync(deployPath)) {
        // We don't need to await this.
        // This can happen in the background.
        image.clone().resize(width, null).toFile(deployPath);
    }
    return {
        width: width,
        height: Math.round(width / originalWidth * originalHeight),
        loadPath: createImageLoadPath(hash, width),
        lqip: lqip
    };
}

export interface ExportedImage {
    sizes: ImageSize[];
    portraitSizes?: ImageSize[];
};

// Return a map from width to static resource path of the image with that width.
// widths shall contain all wished for widths.
// If the image is smaller than any of them, that width won't be used.
export async function convertImage(props: ConvertImageProps): Promise<ExportedImage> {
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
    // For now we set the same lqip for all sizes and only the lqip for the smallest size later.
    const lqip = await getLqip(image, props.lqipWidth, props.lqipHeight);

    let sizes: ImageSize[] = [];
    for (const width of actualWidths) {
        sizes.push(resizeImage(hash, image, metadata.width, metadata.height, width, lqip));
    };
    return { sizes: sizes };
}
