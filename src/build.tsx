// Copyright 2025 Christopher Besch
// This file is published under the MIT license:

// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

import * as fs from "fs";
import { renderToPipeableStream } from "react-dom/server";
import { buildStyles } from "./styles.js";
import { createRouteDeployPath, copyStaticInBG, loadArticlesPath, loadPhotographyPath, getAssetRoute, loadTalksPath, loadProjectsPath, create404RouteDeployPath, loadAboutPath, syncDirSetup, getTagRoute, loadTagPath } from "./paths.js";
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
import TagPage from "./components/tag_page.js";
import TagsPage from "./components/tags_page.js";
import { sortTags } from "./tags.js";

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
        if (article.isPDF) {
            continue;
        }
        buildRouteInBG(article.link, <ArticlePage route={article.link} idx={idx} articles={articles} />);
    }
    buildRouteInBG(loadArticlesPath, <ArticlesPage route={loadArticlesPath} articles={articles} />);
    // Do this in the background.
    createFeed(articles).catch(e => { throw e; });
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

function buildTags(portfolio: Asset[], articles: Article[], talks: Talk[], projects: Project[]) {
    // This includes all unlisted elements.
    const allTags = portfolio.flatMap(p => p.tags)
        .concat(articles.flatMap(a => a.tags))
        .concat(talks.flatMap(t => t.tags))
        .concat(projects.flatMap(p => p.tags));
    const tagsList = sortTags(allTags)

    for (const [tag, _n] of tagsList) {
        buildRouteInBG(getTagRoute(tag), <TagPage route={getTagRoute(tag)} tag={tag} portfolio={portfolio} articles={articles} talks={talks} projects={projects} />);
    }
    buildRouteInBG(loadTagPath, <TagsPage route={loadTagPath} tags={tagsList} />)
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
    buildTags(portfolio, articles, talks, projects);
    buildRouteInBG("/", <IndexPage route="/" portfolio={portfolio} articles={articles} talks={talks} projects={projects} />);
}

SegfaultHandler.default.registerHandler();
startPool();
build();
