import { Piscina } from "piscina";
import { workerPath } from "./paths.js";

let pool: Piscina;

export function startPool() {
    pool = new Piscina({ filename: workerPath });
}

export async function convertImageOnPool(input: string, widths: number[]): Promise<Map<number, string>> {
    return await pool.run({ input, widths }, { name: "convertImage" });
}
