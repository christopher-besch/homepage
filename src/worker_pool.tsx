import { Piscina } from "piscina";
import { workerPath } from "./paths.js";
import { type ConvertImageProps, type ExportedImage } from "./worker.js";

let pool: Piscina;

export function startPool() {
    pool = new Piscina({ filename: workerPath });
}

// We need to create a wrapper for all these worker functions because node.js only loads code for workers from separate files.
export async function convertImageOnPool(props: ConvertImageProps): Promise<ExportedImage> {
    return await pool.run(props, { name: "convertImage" });
}
