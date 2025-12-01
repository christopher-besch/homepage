import sharp from "sharp";
import { createImageDeployPath, createImageLoadPath } from "../paths.js";
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
    inputPath: string,
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
export interface ImageSize {
    // The width in pixels of this size.
    width: number;
    // The height in pixels of this size.
    height: number;
    loadPath: string;
};

// This function doesn't change the image but creates its own clone.
function cropImageHorizontally(image: sharp.Sharp,
    originalWidth: number,
    originalHeight: number,
    aspectRatio: number,
    objectFitPositionH: number
): {
    image: sharp.Sharp,
    // Return the output width and height because image.metadata() always reads the header of the input file.
    width: number,
    height: number
} {
    const targetHeight = originalHeight;
    const targetWidth = targetHeight * aspectRatio;
    // This replicates CSS' behaviour with object-fit: cover and object-position.
    const cropLeft = 0 * (1 - objectFitPositionH / 100) + (originalWidth - targetWidth) * (objectFitPositionH / 100);
    const cropRight = (originalWidth - targetWidth) * (1 - objectFitPositionH / 100) + 0 * (objectFitPositionH / 100);
    if (Math.round(cropLeft + targetWidth + cropRight) != Math.round(originalWidth)) {
        throw new Error(`Widths don't add up: left: ${cropLeft} target: ${targetWidth} right: ${cropRight} actual: ${originalWidth}`);
    }
    return {
        image: image.clone().extract({ left: Math.round(cropLeft), width: Math.round(targetWidth), top: 0, height: targetHeight }),
        width: targetWidth,
        height: targetHeight,
    };
}

// This function doesn't change the image but creates its own clone.
function resizeImage(
    hash: string,
    image: sharp.Sharp,
    originalWidth: number,
    originalHeight: number,
    width: number,
): ImageSize {
    const height = Math.floor(width / originalWidth * originalHeight);
    const deployPath = createImageDeployPath(hash, width, height);
    // If the path already exists, the hashes match and we can use the cache.
    if (!fs.existsSync(deployPath)) {
        // We don't need to await this.
        // This can happen in the background.
        image.clone().resize(width, null).toFile(deployPath);
    }
    return {
        width: width,
        height: height,
        loadPath: createImageLoadPath(hash, width, height),
    };
}

// This function doesn't change the image but creates its own clone if needed.
function resizeImageMultiple(
    image: sharp.Sharp,
    originalWidth: number,
    originalHeight: number,
    hash: string,
    widths: number[],
): ImageSize[] {
    let actualWidths = widths.filter((width) => { return width <= originalWidth; });
    if (actualWidths.length == 0) {
        // None of the target widths are small enough.
        // This is a tiny image.
        actualWidths.push(originalWidth);
    }

    let sizes: ImageSize[] = [];
    for (const width of actualWidths) {
        sizes.push(resizeImage(hash, image, originalWidth, originalHeight, width));
    };
    return sizes;
}

export interface ExportedImage {
    // a map from width to static resource path of the image with that width
    // Widths shall contain all wished for widths.
    // If the image is smaller than any of them, that width won't be used.
    sizes: ImageSize[];
    // Same as sizes but with the portrait version of the image if requested.
    portraitSizes?: ImageSize[];
    // The low quality image preview.
    // There's only one lqip for the entire image.
    lqip: React.CSSProperties;
};

export async function convertImage(props: ConvertImageProps): Promise<ExportedImage> {
    const file = await fs.promises.readFile(props.inputPath);
    const hash = crypto.hash("md5", file);
    const image = sharp(file).autoOrient().webp({ quality: 80, effort: 6 });
    const metadata = await image.metadata();

    let portraitSizes: ImageSize[] | undefined = undefined;
    if (props.portraitVersion != undefined) {
        const crop = cropImageHorizontally(image, metadata.width, metadata.height, props.portraitVersion.aspectRatio, props.portraitVersion.objectFitPositionH);
        // Add the objectFitPositionH to the hash so that when we change that, the cache doesn't bother us.
        // The aspect ratio is already part of the final file because of it's width and height.
        portraitSizes = resizeImageMultiple(crop.image, crop.width, crop.height, `${hash}_${props.portraitVersion.objectFitPositionH}`, props.portraitVersion.widths)
    }

    return {
        sizes: resizeImageMultiple(image, metadata.width, metadata.height, hash, props.widths),
        lqip: await getLqip(image, props.lqipWidth, props.lqipHeight),
        portraitSizes: portraitSizes
    };
}
