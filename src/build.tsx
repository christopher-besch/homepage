import * as fs from "fs";
import { renderToPipeableStream } from "react-dom/server";
import { buildStyles } from "./styles.js";
import { createRouteDeployPath, copyStatic, loadArticlesPath, loadPhotographyPath, getAssetRoute, loadTalksPath, loadProjectsPath } from "./paths.js";
import { startPool } from "./worker/worker_pool.js";

import IndexPage from "./components/index_page.js";
import ArticlePage from "./components/article_page.js";
import { prepareArticles, type Article } from "./articles.js";
import ArticlesPage from "./components/articles_page.js";
import PhotographyPage from "./components/photography_page.js";
import PhotoPage from "./components/photo_page.js";
import { createFeed } from "./feed.js";
import { prepareTalks, type Talk } from "./talks.js";
import TalksPage from "./components/talks_page.js";
import { prepareProjects, type Project } from "./projects.js";
import ProjectsPage from "./components/projects_page.js";
import { prepareImmichPortfolio, type Asset } from "./assets.js";

// Build the route in the background.
// Return immediately.
function buildRouteInBG(route: string, element: React.ReactNode) {
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

async function buildArticles(articles: Article[]) {
    console.log("Building articles");
    for (const [idx, article] of articles.entries()) {
        buildRouteInBG(article.link, <ArticlePage idx={idx} articles={articles} />);
    }
    buildRouteInBG(loadArticlesPath, <ArticlesPage articles={articles} />);
    await createFeed(articles);
}

async function buildPhotography(portfolio: Asset[]) {
    console.log("Building photography");
    for (const [idx, asset] of portfolio.entries()) {
        buildRouteInBG(getAssetRoute(asset.id), <PhotoPage idx={idx} assets={portfolio} />);
    }
    buildRouteInBG(loadPhotographyPath, <PhotographyPage portfolio={portfolio} />)
}

async function buildTalks(talks: Talk[]) {
    console.log("Building talks");
    buildRouteInBG(loadTalksPath, <TalksPage talks={talks} />)
}

async function buildProjects(projects: Project[]) {
    console.log("Building projects");
    buildRouteInBG(loadProjectsPath, <ProjectsPage projects={projects} />)
}

startPool();
// Do this in the background
buildStyles().catch(e => { throw e; });
copyStatic();
buildRouteInBG("/", <IndexPage />);

// Do this in the background
prepareImmichPortfolio().then(buildPhotography).catch(e => { throw e; });
// Do this in the background
prepareArticles().then(buildArticles).catch(e => { throw e; });
prepareTalks().then(buildTalks).catch(e => { throw e; });
prepareProjects().then(buildProjects).catch(e => { throw e; });
