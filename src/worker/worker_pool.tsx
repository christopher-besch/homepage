import { Piscina } from "piscina";
import { workerPath } from "../paths.js";
import { type ConvertImageProps, type ExportedImage } from "./convert_image.js";

let pool: Piscina;

export function startPool() {
    pool = new Piscina({ filename: workerPath });
}

class ExportedImagePromise {
    props: ConvertImageProps;
    exportedImage?: ExportedImage;

    constructor(props: ConvertImageProps) {
        this.props = props;
    }

    async getExportedImage(): Promise<ExportedImage> {
        if (this.exportedImage != undefined) {
            return this.exportedImage;
        }
        this.exportedImage = await pool.run(this.props, { name: "convertImage" });
        return this.exportedImage!;
    }
}
const alreadyConvertedImagePaths = new Map<string, ExportedImagePromise>();

// We need to create a wrapper for all these worker functions because node.js only loads code for workers from separate files.
export async function convertImageOnPool(props: ConvertImageProps): Promise<ExportedImage> {
    // If the image is already being processed, we don't do it again.
    // Otherwise this could lead to a race condition.
    // Also, this is saving resources.
    if (alreadyConvertedImagePaths.has(props.inputPath)) {
        // We only use the file path to identify the image.
        // Theoretically the same image could be exported with different settings.
        // Allowing that would make it a lot more difficult to prevent a race condition.
        const otherProps = alreadyConvertedImagePaths.get(props.inputPath)!.props;
        if (JSON.stringify(otherProps) != JSON.stringify(props)) {
            throw new Error(`Trying to convert the same image twice with different settings: ${JSON.stringify(otherProps)} ${JSON.stringify(props)}`);
        }
        return await alreadyConvertedImagePaths.get(props.inputPath)!.getExportedImage();
    }
    alreadyConvertedImagePaths.set(props.inputPath, new ExportedImagePromise(props));
    return await alreadyConvertedImagePaths.get(props.inputPath)!.getExportedImage();
}
