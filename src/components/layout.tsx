import { Fragment } from "react/jsx-dev-runtime";
import type { ImageSize } from "../convert_image.js";
import { createStyleLoadPath, faviconLoadPath, getArticleRoute, getFullLoadPath, loadAboutPath, loadArticlesPath, loadPhotographyPath, loadProjectsPath, loadRssPath, loadTalksPath } from "../paths.js";
import Image, { getDefaultExportedImage } from "./image.js";

interface LayoutProps {
    route: string,
    title: string,
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
        // TODO: check order
        bannerSizes = exportedBanner.sizes.filter(s => s.width <= 1200).sort((a, b) => b.width - a.width);
    }
    const url = getFullLoadPath(props.route);

    const nav_links = <div className="layout_nav_links">
        <a href={loadArticlesPath}>Articles</a>
        <a href={loadPhotographyPath}>Photos</a>
        <a href={loadProjectsPath}>Projects</a>
        <a href={loadTalksPath}>Talks</a>
        <a href={getArticleRoute("bookmarks")}>Bookmarks</a>
        <a href={loadAboutPath}>About</a>
    </div>;
    return (
        <html>
            <head>
                <meta charSet="UTF-8" />
                <title>{props.title}</title>
                <meta name="viewport" content="width=device-width,initial-scale=1" />
                <link rel="canonical" href={url} />
                <meta property="og:title" content={props.title} />
                <meta property="twitter:title" content={props.title} />
                {props.description != undefined ? <>
                    <meta name="description" content={props.description} />
                    <meta property="og:description" content={props.description} />
                    <meta property="twitter:description" content={props.description} />
                </> : undefined}
                <meta property="og:type" content="article" />
                <meta property="og:url" content={url} />
                <meta property="og:site_name" content="Chris' Place" />
                {bannerSizes.map((banner, idx) => <Fragment key={idx}>
                    <meta property="og:image" content={getFullLoadPath(banner.loadPath)} />
                    <meta property="og:image:width" content={banner.width.toString()} />
                    <meta property="og:image:height" content={banner.height.toString()} />
                </Fragment>)}
                {bannerSizes.length != 0 ? <meta
                    property="twitter:image"
                    content={getFullLoadPath(bannerSizes[0]!.loadPath)}
                /> : undefined}
                <meta
                    name="twitter:card"
                    content={bannerSizes.length != 0 ? "summary_large_image" : "summary"}
                />

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
                    href="/fonts/LiberationSans-Regular-webfont.woff"
                    as="font"
                    type="font/woff"
                    crossOrigin="anonymous"
                />
                <link
                    rel="preload"
                    href="/fonts/LiberationMono-Regular-webfont.woff"
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
            </head>

            <body>
                <div className="layout_navbar">
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
                </div>

                <div className="layout_transient_space">
                    {nav_links}
                    <p>This is a transient space.</p>
                </div>

                <div className="layout_content_container">
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
                </div>

                <div className="layout_footer">
                    <a href={loadAboutPath}>Contact</a>
                    <a href={loadRssPath}>RSS</a>
                    <a href={getArticleRoute("privacy")}>Privacy</a>
                    <div>© 2025 | All rights reserved</div>
                </div>
            </body>
        </html >
    );
}
