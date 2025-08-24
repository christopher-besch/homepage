import { graphql, Link, useStaticQuery } from "gatsby";
import { getImage, GatsbyImage, ImageDataLike } from "gatsby-plugin-image";
import React from "react";

import Heading from "src/components/heading";
import "src/styles/global.scss";
import * as styles from "src/styles/layout.module.scss";

interface LayoutProps {
    icon?: string;
    children?: React.ReactNode;
    heading?: string;
    keep_heading_line?: boolean;
    sub_heading?: string;
    banner_image?: ImageDataLike;
    banner_content?: React.ReactNode;
    banner_image_style?: React.CSSProperties;
    small_banner?: boolean;
}
const Layout = (props: LayoutProps) => {
    const data: Queries.LayoutQuery = useStaticQuery(graphql`
query Layout {
  site {
    siteMetadata {
      source
    }
  }
}
    `);
    const source = data.site?.siteMetadata?.source as string;

    const use_banner_image = props.banner_image != undefined;

    const page_heading = props.heading ? <Heading className={use_banner_image ? styles.white_heading : undefined} heading={props.heading} keep_line={props.keep_heading_line} icon={props.icon} sub_heading={props.sub_heading} /> : undefined;
    const page_header_text = use_banner_image ?
        <div className={styles.banner_content_container}>
            <div className={props.small_banner ? styles.small_banner_content : styles.banner_content}>
                {page_heading}
                {props.banner_content}
            </div>
        </div>
        : <div>
            {page_heading}
            {props.banner_content}
        </div>;

    return (
        <div>
            <nav className={styles.nav}>
                <Link className={styles.logo} to="/">
                    <h1>Christopher Besch</h1>
                    <h2>Software Developer</h2>
                </Link>
                <div>
                    <input type="checkbox" id="nav_toggle" />
                    <label htmlFor="nav_toggle" className={styles.hamburger}>&#9776;</label>
                    <ul className={styles.nav_menu}>
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/articles">Articles</Link></li>
                        <li><Link to="/projects">Projects</Link></li>
                        <li><Link to="/talks">Talks</Link></li>
                        <li><Link to="/photography">Photography</Link></li>
                        <li><Link to="/articles/bookmarks">Bookmarks</Link></li>
                        <li><Link to="/about">About</Link></li>
                    </ul>
                </div>
            </nav >

            {
                use_banner_image
                    ? <div className={styles.banner_container}>
                        <GatsbyImage style={props.banner_image_style} className={`${props.small_banner ? styles.small_banner_image : styles.banner_image}`} image={getImage(props.banner_image!)!} alt="" />
                        {page_header_text}
                    </div>
                    : undefined
            }

            <div className={styles.content}>
                {
                    use_banner_image
                        ? undefined
                        : page_header_text
                }
                {props.children}
            </div>

            <footer className={styles.footer}>
                <ul>
                    <li className={styles.link}><Link to="/about">Contact</Link></li>
                    <li className={styles.link}><a href={source} target="_blank">Source</a></li>
                    <li className={styles.link}><Link to="/privacy">Privacy</Link></li>
                    <li><p>&#169; 2025 | All rights reserved</p></li>
                    <li className={styles.emoji}><p>🔗</p></li>
                </ul>
            </footer>
        </div>
    );
}
export default Layout;

