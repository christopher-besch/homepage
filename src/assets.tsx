import type { Embeddable } from "./embedding.js";
import type { UnembeddedAsset } from "./immich.js";
import { embedImageOnPool, loadImmichPortfolioWithoutEmbeddingOnPool } from "./worker/worker_pool.js";

export interface Asset extends UnembeddedAsset, Embeddable { };

export async function prepareImmichPortfolio(): Promise<Asset[]> {
    // Do this in a separate worker thread because the network timeout may not be reached in the main thread.
    const assetsWithoutEmbedding = await loadImmichPortfolioWithoutEmbeddingOnPool();
    let assets: Asset[] = [];
    for (const a of assetsWithoutEmbedding) {
        assets.push({
            ...a,
            embedding: await embedImageOnPool(a.cachePath),
            listed: true,
        });
    }
    return assets;

    // Doing all at the same time sounds nice but consumes so much memory that the OOM killer is a problem.
    // return await Promise.all(assetsWithoutEmbedding.map(async a => {
    //     return {
    //         ...a,
    //         embedding: await embedImageOnPool(a.cachePath),
    //         listed: true,
    //     };
    // }));
}
