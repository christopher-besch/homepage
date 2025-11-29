import * as fs from "fs";
import { renderToPipeableStream } from "react-dom/server";
import { buildStyles } from "./styles.js";
import { createRouteDeployPath, copyStatic } from "./paths.js";
import { startPool } from "./worker_pool.js";

import Index from "./components/index.js";

function buildRoute(route: string, element: React.ReactNode) {
    const path = createRouteDeployPath(route);
    // We cannot use renderToStaticMarkup because that doesn't support async components.
    let out = renderToPipeableStream(element, {
        onAllReady: () => {
            const stream = fs.createWriteStream(path);
            out.pipe(stream);
        }
    });
}

startPool();
buildStyles();
copyStatic();
buildRoute("/", <Index />);
