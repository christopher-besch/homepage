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
                    <li className={styles.link}><a href="/rss.xml" target="_blank">RSS <svg height="25" className={styles.rssSVG} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path d="M160 96C124.7 96 96 124.7 96 160L96 480C96 515.3 124.7 544 160 544L480 544C515.3 544 544 515.3 544 480L544 160C544 124.7 515.3 96 480 96L160 96zM192 200C192 186.7 202.7 176 216 176C353 176 464 287 464 424C464 437.3 453.3 448 440 448C426.7 448 416 437.3 416 424C416 313.5 326.5 224 216 224C202.7 224 192 213.3 192 200zM192 296C192 282.7 202.7 272 216 272C299.9 272 368 340.1 368 424C368 437.3 357.3 448 344 448C330.7 448 320 437.3 320 424C320 366.6 273.4 320 216 320C202.7 320 192 309.3 192 296zM192 416C192 398.3 206.3 384 224 384C241.7 384 256 398.3 256 416C256 433.7 241.7 448 224 448C206.3 448 192 433.7 192 416z" /></svg></a></li>
                    <li><p>&#169; 2025 | All rights reserved</p></li>
                    <li className={styles.emoji}><p>🔗</p></li>
                </ul>
            </footer>
        </div>
    );
}
export default Layout;

