import * as fs from "fs";
import * as crypto from "crypto";
import path from "path";
import { env } from "process";

// Load paths are for html loading the resource.
// Deploy paths are for javascript to put data there.
// Source paths are where javascript load the data from.

export const homepageURL = env["HOMEPAGE_URL"]!;
if (homepageURL == undefined) {
    throw new Error("HOMEPAGE_URL is not defined");
}
const staticSrcPath = `./static`;
const stylesSrcPath = `./styles`;
const resourcesSrcPath = `./resources`;
const buildPath = `./build`;
export const workerPath = path.join(buildPath, "worker/worker.js");
export const embeddingWorkerPath = path.join(buildPath, "worker/embedding_worker.js");
const deployPath = `./deploy`;
export const modelPath = `./models`;
export const loadAboutPath = `/about`;

function ensureDirExists(dir: string): void {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
}

async function getMDSrcPathsIn(parentDir: string): Promise<string[]> {
    const dirs = await fs.promises.readdir(parentDir);
    let mdSrcPaths: string[] = [];
    for (const dir of dirs) {
        const files = await fs.promises.readdir(path.join(parentDir, dir));
        const mdFiles = files.filter((file) => file.endsWith(".md"));
        if (mdFiles.length != 1) {
            throw new Error("There's a markdown dir without exactly one markdown file.");
        }
        mdSrcPaths.push(path.join(parentDir, dir, mdFiles[0]!));
    };
    return mdSrcPaths;
}

// routes //
export function createRouteDeployPath(route: string): string {
    const dir = path.join(deployPath, route);
    ensureDirExists(dir);
    return path.join(dir, "index.html");
}
export function create404RouteDeployPath(): string {
    ensureDirExists(deployPath);
    return path.join(deployPath, "404.html");
}

export function getFullLoadPath(loadPath: string): string {
    return `${homepageURL}${loadPath}`;
}

// styles //
const loadStylesPath = `/styles`;
const deployStylesPath = path.join(deployPath, loadStylesPath);
export function createStyleLoadPath(style: string): string {
    return path.join(loadStylesPath, style);
}
export function createStyleDeployPath(style: string): string {
    ensureDirExists(deployStylesPath);
    return path.join(deployStylesPath, style);
}
export function getStyleSourcePath(style: string): string {
    return path.join(stylesSrcPath, style);
}

// images //
const loadImagesPath = `/images`;
const deployImagesPath = path.join(deployPath, loadImagesPath);
export function createImageLoadPath(hash: string, width: number, height: number): string {
    return path.join(loadImagesPath, `${hash}_${width}_${height}.webp`);
}
export function createImageDeployPath(hash: string, width: number, height: number): string {
    ensureDirExists(deployImagesPath);
    return path.join(deployImagesPath, `${hash}_${width}_${height}.webp`);
}
// This, for example, is useful for svgs.
// Return the load path.
export async function directCopyImage(inputPath: string): Promise<string> {
    const file = await fs.promises.readFile(inputPath);
    const hash = crypto.hash("md5", file);
    const name = `${hash}${path.extname(inputPath)}`;
    const directImageDeployPath = path.join(deployImagesPath, name);

    if (!fs.existsSync(directImageDeployPath)) {
        fs.promises.cp(inputPath, directImageDeployPath).catch(e => { throw e; });
    }
    return path.join(loadImagesPath, name);
}

// static //
const deployFontsPath = path.join(deployStylesPath, `fonts`);
export function copyStaticInBG() {
    // Make sure we execute one after the other.
    // Because of this the static dir may only contain fonts and things that aren't in subdirs that other code also accesses.
    fs.promises.cp(staticSrcPath, deployPath, { recursive: true }).then(() => {
        fs.promises.cp("./node_modules/katex/dist/fonts", deployFontsPath, { recursive: true });
    }).catch(e => { throw e; });
}

// articles //
const articlesSrcPath = `./articles`;
export const loadArticlesPath = `/articles`;
export async function getArticleSrcPaths(): Promise<string[]> {
    return await getMDSrcPathsIn(articlesSrcPath);
}
export function getArticleRoute(slug: string): string {
    return path.join(loadArticlesPath, slug);
}
export function getFullArticleLoadPath(slug: string): string {
    return getFullLoadPath(getArticleRoute(slug));
}

// talks //
const talksSrcPath = `./talks`;
export const loadTalksPath = `/talks`;
export async function getTalksSrcPaths(): Promise<string[]> {
    return await getMDSrcPathsIn(talksSrcPath);
}

// projects //
const projectsSrc = `./projects`;
export const loadProjectsPath = `/projects`;
export async function getProjectsSrcPaths(): Promise<string[]> {
    return await getMDSrcPathsIn(projectsSrc);
}

// videos //
const loadVideosPath = `/videos`;
const deployVideosPath = path.join(deployPath, loadVideosPath);
function createVideoLoadPath(name: string): string {
    return path.join(loadVideosPath, name);
}
function createVideoDeployPath(name: string): string {
    ensureDirExists(deployVideosPath);
    return path.join(deployVideosPath, name);
}
// Return the loadPath for the video.
export async function copyVideo(inputPath: string): Promise<string> {
    const file = await fs.promises.readFile(inputPath);
    const hash = crypto.hash("md5", file);
    const name = `${hash}${path.extname(inputPath)}`;
    const deployPath = createVideoDeployPath(name);
    // Only copy when there's a new file.
    if (!fs.existsSync(deployPath)) {
        // We don't need to await this.
        // This can happen in the background.
        fs.promises.writeFile(deployPath, file).catch(e => { throw e; });
    }
    return createVideoLoadPath(name);
}

// cache //
const cachePath = `./cache`;
export function getImmichPortfolioPath(): string {
    ensureDirExists(cachePath);
    return path.join(cachePath, "immich_download.json");
}
export function getSentenceEmbeddingCachePath(): string {
    ensureDirExists(cachePath);
    return path.join(cachePath, "sentence_embeddings.json");
}
export function getImageEmbeddingCachePath(): string {
    ensureDirExists(cachePath);
    return path.join(cachePath, "image_embeddings.json");
}
export function getImmichCachePath(name: string): string {
    ensureDirExists(cachePath);
    return path.join(cachePath, name);
}

// asssets //
export const loadPhotographyPath = `/photography`;
export function getAssetRoute(id: string): string {
    return path.join(loadPhotographyPath, id);
}

export function getResourceLoadPath(name: string): string {
    return path.join(resourcesSrcPath, name);
}

// favicon //
export const faviconLoadPath = `/favicon.png`;
export const fullFaviconLoadPath = getFullLoadPath(faviconLoadPath);

// rss //
export const loadRssPath = `/rss.xml`;
export function createRssFeedDeployPath(): string {
    ensureDirExists(deployPath);
    return path.join(deployPath, loadRssPath);
}
