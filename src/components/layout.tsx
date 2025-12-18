import { Fragment } from "react/jsx-dev-runtime";
import type { ImageSize } from "../convert_image.js";
import { createStyleLoadPath, faviconLoadPath, getArticleRoute, getFullLoadPath, loadAboutPath, loadArticlesPath, loadPhotographyPath, loadProjectsPath, loadRssPath, loadTalksPath } from "../paths.js";
import Image, { getDefaultExportedImage } from "./image.js";

interface LayoutProps {
    route: string,
    title: string,
    date?: Date,
    banner?: string,
    description?: string,
    styleSheets: string[],
    heroImage?: {
        inputPath: string,
        heightFraction?: number,
        objectFitHorizontal: number,
        objectFitVertical: number,
        children?: React.ReactNode,
    },
}
export default async function Layout(props: React.PropsWithChildren<LayoutProps>): Promise<React.ReactNode> {
    let bannerSizes: ImageSize[] = [];
    if (props.banner != undefined) {
        const exportedBanner = await getDefaultExportedImage({ lazy: false, inputPath: props.banner });
        bannerSizes = exportedBanner.sizes.filter(s => s.width <= 1200).sort((a, b) => b.width - a.width);
    }
    const url = getFullLoadPath(props.route);

    const website_id = process.env["WEBSITE_ID"]
    if (website_id == undefined) {
        throw new Error("WEBSITE_ID env variable needs to be defined.");
    }

    const nav_links = <div className="layout_nav_links">
        <a href={loadArticlesPath}>Articles</a>
        <a href={loadPhotographyPath}>Photos</a>
        <a href={loadProjectsPath}>Projects</a>
        <a href={loadTalksPath}>Talks</a>
        <a href={getArticleRoute("bookmarks")}>Bookmarks</a>
        <a href={loadAboutPath}>About</a>
    </div>;

    // Use the title as a fallback.
    const description = props.description != undefined ? props.description : props.title;
    return (
        <html lang="en">
            <head>
                <meta charSet="UTF-8" />
                <title>{props.title}</title>
                <meta name="viewport" content="width=device-width,initial-scale=1" />
                <link rel="canonical" href={url} />
                <meta property="og:title" content={props.title} />
                <meta property="twitter:title" content={props.title} />
                <meta name="description" content={description} />
                <meta property="og:description" content={description} />
                <meta property="twitter:description" content={description} />
                <meta property="og:type" content="article" />
                <meta property="og:url" content={url} />
                <meta property="og:site_name" content="Chris' Place" />
                {bannerSizes.map((banner, idx) => <Fragment key={idx}>
                    <meta property="og:image" content={getFullLoadPath(banner.loadPath)} />
                    <meta property="og:image:width" content={banner.width.toString()} />
                    <meta property="og:image:height" content={banner.height.toString()} />
                    {/* This is entirely decorative. */}
                    <meta property="og:image:alt" content="" />
                </Fragment>)}
                {bannerSizes.length != 0 ? <meta
                    property="twitter:image"
                    content={getFullLoadPath(bannerSizes[0]!.loadPath)}
                /> : undefined}
                <meta
                    name="twitter:card"
                    content={bannerSizes.length != 0 ? "summary_large_image" : "summary"}
                />
                {props.date != undefined ?
                    <meta name="og:article:published_time" content={props.date!.toISOString()} />
                    : undefined}

                <meta name="og:article:author" content="Christopher Besch" />
                {/* TODO: tags */}

                <meta
                    name="twitter:site"
                    content="@besch_chris"
                />
                <meta
                    name="twitter:creator"
                    content="@besch_chris"
                />

                <meta name="author" content="Christopher Besch" />

                {/* preloading fonts */}
                <link
                    rel="preload"
                    href="/styles/fonts/LiberationSans-Regular-webfont.woff"
                    as="font"
                    type="font/woff"
                    crossOrigin="anonymous"
                />
                <link
                    rel="preload"
                    href="/styles/fonts/LiberationMono-Regular-webfont.woff"
                    as="font"
                    type="font/woff"
                    crossOrigin="anonymous"
                />

                {/* Samsung Internet likes to be special: https://developer.samsung.com/internet/blog/en/2020/12/15/dark-mode-in-samsung-internet */}
                {/* this doesn't actually work: https://forum.developer.samsung.com/t/websites-dark-mode-gets-overridden-by-samsung-internets-dark-mode/22937/11 */}
                {/* the user has to set this: Internet → Settings → Labs → "Use website dark theme" */}
                <meta name="color-scheme" content="light dark" />

                {/* mastodon things */}
                <link
                    rel="me"
                    href="https://mastodon.social/@christopher_besch"
                />
                <meta name="fediverse:creator" content="@christopher_besch@mastodon.social" />

                {props.styleSheets.map((styleSheet, i) =>
                    <link key={i} rel="stylesheet" type="text/css" href={createStyleLoadPath(styleSheet)} />
                )}

                <link rel="icon" type="image/png" sizes="48x48" href={faviconLoadPath} />

                <script defer src="https://analytics.chris-besch.com/script.js" data-website-id={website_id}></script>
            </head>

            <body>
                <nav className="layout_navbar" role="navigation">
                    <a className="layout_navbar_left" href="/">
                        <h1>Christopher&nbsp;Besch</h1>
                        <h2>Developer&bull;Writer&bull;Photographer</h2>
                    </a>
                    <div className="layout_navbar_right">
                        <input id="layout_navbar_toggle" type="checkbox"></input>
                        <label htmlFor="layout_navbar_toggle" className="layout_navbar_hamburger">
                            <div></div>
                            <div></div>
                            <div></div>
                        </label>
                        {nav_links}
                    </div>
                </nav>

                <div className="layout_transient_space">
                    {nav_links}
                    <p>This is a transient space.</p>
                </div>

                <main className="layout_content_container" role="main">
                    {props.heroImage != undefined ?
                        <div className="layout_hero"
                            style={{
                                "--layout-object-fit-h": `${props.heroImage.objectFitHorizontal}%`,
                                "--layout-object-fit-v": `${props.heroImage.objectFitVertical}%`,
                                "--layout-hero-fraction": props.heroImage.heightFraction != undefined ? props.heroImage.heightFraction : 1,
                            } as React.CSSProperties}>
                            <Image inputPath={props.heroImage.inputPath} portraitVersion={{ objectFitPositionH: props.heroImage.objectFitHorizontal }} lazy={false} />
                            <div className="layout_hero_children">
                                {props.heroImage.children}
                            </div>
                        </div>
                        : undefined}

                    <div className="layout_content">
                        {props.children}
                    </div>
                </main>

                <footer className="layout_footer" role="contentinfo">
                    <a href={loadAboutPath}>Contact</a>
                    <a href={loadRssPath}>RSS</a>
                    <a href={getArticleRoute("privacy")}>Privacy</a>
                    <div>© 2025 | All rights reserved</div>
                </footer>
            </body>
        </html >
    );
}
