import { graphql, Link, useStaticQuery } from "gatsby";
import React from "react";
import { Helmet } from "react-helmet";
import { globalHistory } from "@reach/router";

import Heading from "src/components/heading";
import "src/styles/global.scss";
import * as styles from "src/styles/layout.module.scss";

interface LayoutProps {
    children?: React.ReactNode;
    heading?: string;
    sub_heading?: string;
    icon?: string;
    description?: string;
    banner?: string;
}
const Layout = (props: LayoutProps) => {
    const data: Queries.LayoutQuery = useStaticQuery(graphql`
query Layout {
  site {
    siteMetadata {
      source
      origin
      default_origin
      cloudflare_token
    }
  }
}
    `);
    const source = data.site?.siteMetadata?.source as string;
    const title = props.heading ? `${props.heading}—Christopher Besch` : "Christopher Besch—Software Developer";
    const description = props.description;

    const url = globalHistory.location.href;
    const origin = data.site?.siteMetadata?.origin;
    const deploy_origin = data.site?.siteMetadata?.default_origin as string;
    const path = globalHistory.location.pathname;
    // replace origin with default one
    const canonical_url = `${deploy_origin}${path}`;

    const banner = props.banner ? `${origin}${props.banner}` : undefined;

    return (
        <div>
            <Helmet htmlAttributes={{ lang: "en" }}>
                <meta charSet="utf-8" />
                <title>{title}</title>
                <link rel="canonical" href={canonical_url} />
                <link rel="shortcut icon" href="/favicon.png" />
                <meta
                    property="og:url"
                    content={url}
                />
                <meta
                    property="og:title"
                    content={title}
                />
                {description ? <meta
                    property="og:description"
                    content={description} /> : undefined}
                {banner ? <meta
                    property="og:image"
                    content={banner}
                /> : undefined}
                <meta
                    name="twitter:card"
                    content={banner ? "summary_large_image" : "summary"}
                />
                <meta
                    name="twitter:site"
                    content="@besch_chris"
                />
                <meta
                    name="twitter:creator"
                    content="@besch_chris"
                />
                {banner ? <meta
                    property="twitter:image:src"
                    content={banner}
                /> : undefined}

                <meta
                    name="author"
                    content="Christopher Besch"
                />
                <meta
                    name="description"
                    content={title}
                />

                {/* cloudflare analytics */}
                <script defer src="https://static.cloudflareinsights.com/beacon.min.js"
                    data-cf-beacon={JSON.stringify({ token: data.site?.siteMetadata?.cloudflare_token })}></script>

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
            </Helmet>
            <nav className={styles.nav}>
                <div className={styles.logo}>
                    <h1>Christopher Besch</h1>
                    <h2>Software Developer</h2>
                </div>
                <div>
                    <input type="checkbox" id="nav_toggle" />
                    <label htmlFor="nav_toggle" className={styles.hamburger}>&#9776;</label>
                    <ul className={styles.nav_menu}>
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/projects">Projects</Link></li>
                        <li><Link to="/articles">Articles</Link></li>
                        <li><Link to="/about">About</Link></li>
                    </ul>
                </div>
            </nav >

            <div className={styles.content}>
                {props.heading ? <Heading heading={props.heading} icon={props.icon} sub_heading={props.sub_heading} /> : undefined}
                {props.children}
            </div>

            <footer className={styles.footer}>
                <ul>
                    <li className={styles.link}><Link to="/about">Contact</Link></li>
                    <li className={styles.link}><a href={source} target="_blank">Source</a></li>
                    <li className={styles.link}><Link to="/privacy">Privacy</Link></li>
                    <li><p>&#169; 2022</p></li>
                    <li className={styles.emoji}><p>🔗</p></li>
                </ul>
            </footer>
        </div>
    );
}
export default Layout;

