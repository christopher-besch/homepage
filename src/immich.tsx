import { downloadAsset, getAllTags, getAssetInfo, init, searchAssets, type AssetResponseDto } from "@immich/sdk";
import { getImmichCachePath, getImmichPortfolioPath as immichPortfolioJSONPath } from "./paths.js";
import path from "path";
import * as fs from "fs";
import { type Embeddable } from "./embedding.js";
import { embedImageOnPool } from "./worker/worker_pool.js";

const PORTFOLIO_TAG = "portfolio";

export interface UnembeddedAsset {
    id: string,
    cachePath: string,
    tags: string[],
    rating: number,
};

export interface Asset extends UnembeddedAsset, Embeddable { };

// Download from Immich or if cached load JSON.
async function loadImmichPortfolioWithoutEmbedding(): Promise<UnembeddedAsset[]> {
    // Don't do anything if we've already downloaded everything.
    if (fs.existsSync(immichPortfolioJSONPath())) {
        console.log("Using immich image cache.");
        const file = await fs.promises.readFile(immichPortfolioJSONPath());
        return JSON.parse(file.toString());
    }

    const IMMICH_BASE_URL = process.env['IMMICH_BASE_URL']!;
    if (IMMICH_BASE_URL == undefined || IMMICH_BASE_URL == "") {
        throw new Error("IMMICH_BASE_URL not defined");
    }
    console.log(`Downloading immich images from ${IMMICH_BASE_URL}`);
    // Needed permissions: asset.read, asset.download, tag.read
    const IMMICH_API_KEY = process.env['IMMICH_API_KEY']!;
    if (IMMICH_API_KEY == undefined || IMMICH_API_KEY == "") {
        throw new Error("IMMICH_API_KEY not defined");
    }
    init({ baseUrl: IMMICH_BASE_URL, apiKey: IMMICH_API_KEY })

    // Get all tags.
    const rawTags = await getAllTags({});
    const tagToId = new Map<string, string>(rawTags.map(t => [t.name, t.id]));
    if (!tagToId.has(PORTFOLIO_TAG)) {
        throw new Error(`Didn't fine ${PORTFOLIO_TAG} tag.`);
    }

    // Get assets.
    const { assets: rawAssets } = await searchAssets({
        metadataSearchDto: {
            tagIds: [tagToId.get(PORTFOLIO_TAG)!]
        }
    });
    console.log(`Found ${rawAssets.items.length} assets`);
    // Get full asset info.
    const assetInfos = await Promise.all(rawAssets.items.map(async a => getAssetInfo({ id: a.id })));

    // TODO: use zip download
    // Download asset if not cached.
    console.log("Starting Immich download.");
    let assets: { cachePath: string, asset: AssetResponseDto }[] = [];
    for (const a of assetInfos) {
        const extname = path.extname(a.originalFileName);
        const name = `${a.id}${extname}`;
        const cachePath = getImmichCachePath(name);
        if (!fs.existsSync(cachePath)) {
            const blob = await downloadAsset({ id: a.id });
            console.log(`Downloaded ${cachePath}`);
            fs.promises.writeFile(cachePath, blob.stream());
            assets.push({ cachePath: cachePath, asset: a });
        } else {
            console.log(`Using cache for ${cachePath}`);
            assets.push({ cachePath: cachePath, asset: a });
        }
    }
    console.log("Completed Immich download.");

    // Convert into proper format.
    const portfolio: UnembeddedAsset[] = assets.map(({ cachePath, asset }) => {
        if (asset.exifInfo == undefined || asset.exifInfo.rating == undefined) {
            throw new Error(`${asset.originalFileName} doesn't have a rating.`);
        }
        if (asset.tags == undefined) {
            throw new Error(`${asset.originalFileName} doesn't have tags.`);
        }
        return {
            id: asset.id,
            cachePath: cachePath,
            tags: asset.tags.map(t => t.name).filter(n => n != PORTFOLIO_TAG),
            rating: asset.exifInfo.rating
        };
    });
    const jsonPortfolio = JSON.stringify(portfolio, null, 4);
    fs.promises.writeFile(immichPortfolioJSONPath(), jsonPortfolio);
    return portfolio;
}

export async function prepareImmichPortfolio(): Promise<Asset[]> {
    const assetsWithoutEmbedding = await loadImmichPortfolioWithoutEmbedding();
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
