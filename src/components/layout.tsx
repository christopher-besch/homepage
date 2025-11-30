import { createStyleLoadPath } from "../paths.js";
import Image from "./image.js";

interface LayoutProps {
    title: string,
    description?: string,
    styleSheets: string[],
    heroImage?: {
        loadPath: string,
        heightFraction?: number,
        objectFitHorizontal: number,
        objectFitVertical: number,
        children?: React.ReactNode,
    },
}
export default function Layout(props: React.PropsWithChildren<LayoutProps>): React.ReactNode {
    const nav_links = <div className="layout_nav_links">
        <a href="/articles">Articles</a>
        <a href="/photography">Photos</a>
        <a href="/projects">Projects</a>
        <a href="/talks">Talks</a>
        <a href="/articles/bookmarks">Bookmarks</a>
        <a href="/about">About</a>
    </div>;
    return (
        <html>
            <head>
                <meta charSet="UTF-8" />
                <title>{props.title}</title>
                <meta name="viewport" content="width=device-width,initial-scale=1" />
                <meta name="description" content={props.description} />
                {/* TODO: add social banner and the likes */}

                {props.styleSheets.map((styleSheet, i) =>
                    <link key={i} rel="stylesheet" type="text/css" href={createStyleLoadPath(styleSheet)} />
                )}

                {/* <link rel="icon" href="favicon.png" /> */}
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
                            <Image inputPath={props.heroImage.loadPath} portraitVersion={{ objectFitPositionH: props.heroImage.objectFitHorizontal }} />
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
                    <a href="/about">Contact</a>
                    <a href="/rss.xml">RSS</a>
                    <a href="/privacy">Privacy</a>
                    <div>© 2025 | All rights reserved</div>
                </div>
            </body>
        </html>
    );
}
