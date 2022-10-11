import { graphql, Link, useStaticQuery } from "gatsby";
import React from "react";

import Heading from "src/components/heading";
import "src/styles/global.scss";
import * as styles from "src/styles/layout.module.scss";

interface LayoutProps {
    icon?: string;
    children?: React.ReactNode;
    heading?: string;
    sub_heading?: string;
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

    return (
        <div>
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

