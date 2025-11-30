import * as fs from "fs";
import path from "path";

// Load paths are for html loading the resource.
// Deploy paths are for javascript to put data there.
// Source paths are where javascript load the data from.

const staticPath = `./static`;
const stylesPath = `./styles`;
const articlesPath = `./articles`;
const buildPath = `./build`;
export const workerPath = path.join(buildPath, "worker.js");
const deployPath = `./deploy`;

function ensureDirExists(dir: string) {
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
export function copyStatic() {
    fs.cp(staticPath, deployPath, { recursive: true }, (err) => { if (err != null) { throw err; } });
}

// articles //
const loadArticlesPath = `/articles`;
export async function getArticles(): Promise<string[]> {
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
