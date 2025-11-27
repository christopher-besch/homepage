import * as fs from "fs";
import { renderToPipeableStream } from "react-dom/server";
import { buildStyles } from "./styles.js";
import { createRouteDeployPath } from "./paths.js";
import { startPool } from "./worker_pool.js";

import Index from "./components/index.js";

function buildRoute(route: string, element: React.ReactNode) {
    const path = createRouteDeployPath(route);
    let stream = fs.createWriteStream(path);
    stream.write("<!DOCTYPE html>");
    // We cannot ues renderToStaticMarkup because that doesn't support async components.
    let out = renderToPipeableStream(element, {
        onAllReady: () => {
            out.pipe(stream);
        }
    });
}

startPool();
buildStyles();
buildRoute("/", <Index />);
