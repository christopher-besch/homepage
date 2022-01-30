import { graphql, Link, useStaticQuery } from "gatsby";
import React from "react";
import { SiteInfo } from "./__generated__/site-info";
import { Helmet } from "react-helmet";

import Heading from "src/components/heading";
import "src/styles/global.scss";
import * as styles from "src/styles/layout.module.scss";

interface LayoutProps {
    heading?: string;
    sub_heading?: string;
    icon?: string;
    description?: string;
    banner?: string;
}
const Layout: React.FC<LayoutProps> = (props) => {
    const data: SiteInfo = useStaticQuery(graphql`
query SiteInfo {
  site {
    siteMetadata {
      source
      address
    }
  }
}
    `);
    const source = data.site?.siteMetadata?.source as string;
    const address = data.site?.siteMetadata?.address as string;
    const title = props.heading ? `${props.heading}—Christopher Besch` : "Christopher Besch—Software Developer";
    const description = props.description;
    const banner = props.banner;

    return (
        <div>
            <Helmet htmlAttributes={{ lang: "en" }}>
                <meta charSet="utf-8" />
                <meta property="og:title" content={title} />
                {description ? <meta property="og:description" content={description} /> : undefined}
                {banner ? <meta property="og:image" content={banner} /> : undefined}
                <meta name="twitter:site" content="@besch_chris" />
                <meta name="twitter:card" content={banner ? "summary || summary_large_image" : "summary"} />
                <meta name="twitter:creator" content="@besch_chris" />

                <meta name="author" content="Christopher Besch" />
                <meta name="description" content={title} />
                <title>{title}</title>
                <link rel="canonical" href={address} />
                <link rel="shortcut icon" href="/favicon.png" />
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
                        <li><Link to="/about">About</Link></li>
                        <li><Link to="/articles">Articles</Link></li>
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
