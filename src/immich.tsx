import { downloadAsset, getAllTags, getAssetInfo, init, searchAssets } from "@immich/sdk";
import { getImmichCachePath, immichPortfolioPath as immichPortfolioJSONPath } from "./paths.js";
import path from "path";
import * as fs from "fs";

const PORTFOLIO_TAG = "portfolio";

export interface Asset {
    cachePath: string,
    tags: string[],
    rating: number,
};

export async function loadImmichPortfolio(): Promise<Asset[]> {
    // Don't do anything if we've already downloaded everything.
    if (fs.existsSync(immichPortfolioJSONPath)) {
        const file = await fs.promises.readFile(immichPortfolioJSONPath);
        return JSON.parse(file.toString());
    }

    const IMMICH_BASE_URL = process.env['IMMICH_BASE_URL']!;
    // Needed permissions: asset.read, asset.download, tag.read
    const IMMICH_API_KEY = process.env['IMMICH_API_KEY']!;
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
    // Get full asset info and download asset if not cached.
    const assets = await Promise.all(rawAssets.items.map(async a => {
        const fullAPromise = getAssetInfo({ id: a.id });
        const extname = path.extname(a.originalFileName);
        const name = `${a.id}${extname}`;
        const cachePath = getImmichCachePath(name);
        if (!fs.existsSync(cachePath)) {
            const [fullA, blob] = await Promise.all([fullAPromise, downloadAsset({ id: a.id })]);
            fs.promises.writeFile(cachePath, blob.stream());
            return { cachePath: cachePath, asset: fullA };
        }
        return { cachePath: cachePath, asset: await fullAPromise };
    }));
    // Convert into proper format.
    const portfolio: Asset[] = assets.map(({ cachePath, asset }) => {
        if (asset.exifInfo == undefined || asset.exifInfo.rating == undefined) {
            throw new Error(`${asset.originalFileName} doesn't have a rating.`);
        }
        if (asset.tags == undefined) {
            throw new Error(`${asset.originalFileName} doesn't have tags.`);
        }
        return {
            cachePath: cachePath,
            tags: asset.tags.map(t => t.name).filter(n => n != PORTFOLIO_TAG),
            rating: asset.exifInfo.rating
        };
    });
    const jsonPortfolio = JSON.stringify(portfolio, null, 4);
    fs.promises.writeFile(immichPortfolioJSONPath, jsonPortfolio);
    return portfolio;
}
