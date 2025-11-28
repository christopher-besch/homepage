import { Piscina } from "piscina";
import { workerPath } from "./paths.js";
import { ImageSize } from "./worker.js";

let pool: Piscina;

export function startPool() {
    pool = new Piscina({ filename: workerPath });
}

export async function convertImageOnPool(input: string, widths: number[]): Promise<ImageSize[]> {
    return await pool.run({ input, widths }, { name: "convertImage" });
}
