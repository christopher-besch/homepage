import * as fs from "fs";

const stylesPath = `./styles`;

const deployPath = `./deploy`;
const deployStylesPath = `${deployPath}/styles`;

function ensureDirExists(dir: string) {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
}

export function createRoute(route: string): string {
    const dir = `${deployPath}/${route}`;
    ensureDirExists(dir);
    return `${dir}/index.html`;
}

export function createStyles(): string {
    ensureDirExists(deployStylesPath);
    return deployStylesPath;
}

export function getStyleSource(style: string): string {
    return `${stylesPath}/${style}`;
}
