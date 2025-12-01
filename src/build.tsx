import * as fs from "fs";
import { renderToPipeableStream } from "react-dom/server";
import { buildStyles } from "./styles.js";
import { createRouteDeployPath, copyStatic, getArticles, getArticleDeployRoute } from "./paths.js";
import { startPool } from "./worker/worker_pool.js";

import IndexPage from "./components/index_page.js";
import ArticlePage from "./components/article_page.js";
import { prepareArticle } from "./article.js";

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

async function buildArticles() {
    const articlePaths = await getArticles();
    const articles = await Promise.all(articlePaths.map(prepareArticle));
    for (const article of articles) {
        buildRoute(getArticleDeployRoute(article.slug), <ArticlePage article={article}>{article.html}</ArticlePage>);
    }
}

startPool();
buildStyles();
copyStatic();
buildRoute("/", <IndexPage />);
await buildArticles();
