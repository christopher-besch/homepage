import * as fs from "fs";
import { renderToPipeableStream } from "react-dom/server";
import { buildStyles } from "./styles.js";
import { createRouteDeployPath, copyStaticInBG, loadArticlesPath, loadPhotographyPath, getAssetRoute, loadTalksPath, loadProjectsPath, create404RouteDeployPath, loadAboutPath, syncDirSetup } from "./paths.js";
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
import * as SegfaultHandler from "segfault-handler";
import PageNotFoundPage from "./components/page_not_found_page.js";
import AboutPage from "./components/about_page.js";

// Build the route in the background.
// Return immediately.
function buildLoadPathHTMLInBG(path: string, element: React.ReactNode) {
    console.log(`Build path ${path}`);
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

// A route is a path with an index.html file.
// Build the route in the background.
// Return immediately.
function buildRouteInBG(route: string, element: React.ReactNode) {
    buildLoadPathHTMLInBG(createRouteDeployPath(route), element);
}

async function buildArticles(articles: Article[]) {
    console.log("Building articles");
    for (const [idx, article] of articles.entries()) {
        buildRouteInBG(article.link, <ArticlePage route={article.link} idx={idx} articles={articles} />);
    }
    buildRouteInBG(loadArticlesPath, <ArticlesPage route={loadArticlesPath} articles={articles} />);
    await createFeed(articles);
}

async function buildPhotography(portfolio: Asset[]) {
    console.log("Building photography");
    for (const [idx, asset] of portfolio.entries()) {
        const route = getAssetRoute(asset.id);
        buildRouteInBG(route, <PhotoPage route={route} idx={idx} assets={portfolio} />);
    }
    buildRouteInBG(loadPhotographyPath, <PhotographyPage route={loadPhotographyPath} portfolio={portfolio} />)
}

async function buildTalks(talks: Talk[]) {
    console.log("Building talks");
    buildRouteInBG(loadTalksPath, <TalksPage route={loadTalksPath} talks={talks} />)
}

async function buildProjects(projects: Project[]) {
    console.log("Building projects");
    buildRouteInBG(loadProjectsPath, <ProjectsPage route={loadProjectsPath} projects={projects} />)
}

async function build() {
    syncDirSetup();
    // Do this in the background
    buildStyles().catch(e => { throw e; });
    copyStaticInBG();
    buildLoadPathHTMLInBG(create404RouteDeployPath(), <PageNotFoundPage route="/" />);
    buildRouteInBG(loadAboutPath, <AboutPage route={loadAboutPath} />);

    const [portfolio, articles, talks, projects] = await Promise.all([
        prepareImmichPortfolio().then(p => {
            // Do this in the background
            buildPhotography(p).catch(e => { throw e; });
            return p;
        }),
        prepareArticles().then(a => {
            // Do this in the background
            buildArticles(a).catch(e => { throw e; });
            return a;
        }),
        prepareTalks().then(t => {
            // Do this in the background
            buildTalks(t).catch(e => { throw e; });
            return t;
        }),
        prepareProjects().then(p => {
            // Do this in the background
            buildProjects(p).catch(e => { throw e; });
            return p;
        }),
    ]);
    buildRouteInBG("/", <IndexPage route="/" portfolio={portfolio} articles={articles} talks={talks} projects={projects} />);
}

SegfaultHandler.default.registerHandler();
startPool();
build();
