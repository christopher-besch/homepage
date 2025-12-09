import * as fs from "fs";
import { renderToPipeableStream } from "react-dom/server";
import { buildStyles } from "./styles.js";
import { createRouteDeployPath, copyStatic, getArticles, getArticleDeployRoute, loadArticlesPath, loadPhotographyPath, getAssetDeployRoute } from "./paths.js";
import { startPool } from "./worker/worker_pool.js";

import IndexPage from "./components/index_page.js";
import ArticlePage from "./components/article_page.js";
import { prepareArticles } from "./article.js";
import ArticlesPage from "./components/articles_page.js";
import { loadImmichPortfolio, type Asset } from "./immich.js";
import PhotographyPage from "./components/photography_page.js";
import PhotoPage from "./components/photo_page.js";

// Build the route in the background.
// Return immediately.
function buildRoute(route: string, element: React.ReactNode) {
    console.log(`Build route ${route}`);
    const path = createRouteDeployPath(route);
    // We cannot use renderToStaticMarkup because that doesn't support async components.
    let out = renderToPipeableStream(element, {
        onAllReady: () => {
            const stream = fs.createWriteStream(path);
            out.pipe(stream);
        },
        onError: (e) => {
            throw e;
        },
        onShellError: (e) => {
            throw e;
        },
    });
}

async function buildArticles() {
    console.log("Building articles");
    const articlePaths = await getArticles();
    const articles = await prepareArticles(articlePaths);
    for (const [idx, article] of articles.entries()) {
        buildRoute(getArticleDeployRoute(article.slug), <ArticlePage idx={idx} articles={articles} />);
    }
    buildRoute(loadArticlesPath, <ArticlesPage articles={articles} />);
}

async function buildPhotography(portfolio: Asset[]) {
    console.log("Building photography");
    for (const [idx, asset] of portfolio.entries()) {
        buildRoute(getAssetDeployRoute(asset.id), <PhotoPage idx={idx} assets={portfolio} />);
    }
    buildRoute(loadPhotographyPath, <PhotographyPage portfolio={portfolio} />)
}

startPool();
// Do this in the background
loadImmichPortfolio().then(buildPhotography).catch(e => { throw e; });
// Do this in the background
buildStyles().catch(e => { throw e; });
copyStatic();
buildRoute("/", <IndexPage />);
buildArticles().catch(e => { throw e; });
