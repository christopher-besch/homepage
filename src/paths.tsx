import * as fs from "fs";
import * as crypto from "crypto";
import path from "path";

// Load paths are for html loading the resource.
// Deploy paths are for javascript to put data there.
// Source paths are where javascript load the data from.

const staticPath = `./static`;
const stylesPath = `./styles`;
const resources = `./resources`;
const articlesPath = `./articles`;
const buildPath = `./build`;
export const workerPath = path.join(buildPath, "worker/worker.js");
const deployPath = `./deploy`;
export const modelPath = `./models`;
export const loadRssPath = `/rss.xml`;
export const loadAboutPath = `/about`;

function ensureDirExists(dir: string): void {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
}

// routes //
export function createRouteDeployPath(route: string): string {
    const dir = path.join(deployPath, route);
    ensureDirExists(dir);
    return path.join(dir, "index.html");
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
    return path.join(stylesPath, style);
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

// static //
const deployFontsPath = path.join(deployStylesPath, `fonts`);
export function copyStatic() {
    // Make sure we execute one after the other.
    // Because of this the static dir may only contain fonts and things that aren't in subdirs that other code also accesses.
    fs.promises.cp(staticPath, deployPath, { recursive: true }).then(() => {
        fs.promises.cp("./node_modules/katex/dist/fonts", deployFontsPath, { recursive: true });
    }).catch(e => { throw e; });
}

// articles //
export const loadArticlesPath = `/articles`;
export async function getArticlePaths(): Promise<string[]> {
    const dirs = await fs.promises.readdir(articlesPath);
    let articles: string[] = [];
    for (const dir of dirs) {
        const files = await fs.promises.readdir(path.join(articlesPath, dir));
        const mdFiles = files.filter((file) => file.endsWith(".md"));
        if (mdFiles.length != 1) {
            throw new Error("There's a markdown dir without exactly one markdown file.");
        }
        articles.push(path.join(articlesPath, dir, mdFiles[0]!));
    };
    return articles;
}

export function getArticleDeployRoute(slug: string): string {
    return path.join(loadArticlesPath, slug);
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
export function getAssetDeployRoute(id: string): string {
    return path.join(loadPhotographyPath, id);
}

export function getResourceLoadPath(name: string): string {
    return path.join(resources, name);
}

// projects //
export const loadProjectsPath = `/projects`;

// talks //
export const loadTalksPath = `/talks`;
