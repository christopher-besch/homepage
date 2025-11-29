import * as fs from "fs";

// Load paths are for html loading the resource.
// Deploy paths are for javascript to put data there.
// Source paths are where javascript load the data from.

const staticPath = `./static`;
const stylesPath = `./styles`;
const buildPath = `./build`;
export const workerPath = `${buildPath}/worker.js`;
const deployPath = `./deploy`;

function ensureDirExists(dir: string) {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
}

// routes //
export function createRouteDeployPath(route: string): string {
    const dir = `${deployPath}/${route}`;
    ensureDirExists(dir);
    return `${dir}/index.html`;
}

// styles //
const loadStylesPath = `/styles`;
const deployStylesPath = `${deployPath}${loadStylesPath}`;

export function createStyleLoadPath(style: string): string {
    return `${loadStylesPath}/${style}`;
}

export function createStyleDeployPath(style: string): string {
    ensureDirExists(deployStylesPath);
    return `${deployStylesPath}/${style}`;
}

export function getStyleSourcePath(style: string): string {
    return `${stylesPath}/${style}`;
}

// images //
const loadImagesPath = `/images`;
const deployImagesPath = `${deployPath}${loadImagesPath}`;

export function createImageLoadPath(hash: string, width: number): string {
    return `${loadImagesPath}/${hash}_${width}.webp`;
}

export function createImageDeployPath(hash: string, width: number): string {
    ensureDirExists(deployImagesPath);
    return `${deployImagesPath}/${hash}_${width}.webp`;
}

// static //
export function copyStatic() {
    fs.cp(staticPath, deployPath, { recursive: true }, (err) => { if (err != null) { throw err; } });
}
