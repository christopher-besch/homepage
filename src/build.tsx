import * as react_renderer from "react-dom/server";
import Index from "./components/index.js";
import * as fs from "fs";
import { buildStyles } from "./styles.js";
import { createRoute } from "./paths.js";

function buildRoute(route: string, element: React.ReactNode) {
    const html = `<!DOCTYPE html>${react_renderer.renderToStaticMarkup(element)}`;
    const path = createRoute(route);
    fs.writeFileSync(path, html);
}

buildStyles();
buildRoute("/", <Index />);
