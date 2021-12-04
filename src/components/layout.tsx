import { graphql, Link, useStaticQuery } from "gatsby";
import React from "react";

import "../styles/global.css";
import * as styles from "../styles/layout.module.css";
import { SiteInfo } from "./__generated__/site-info";

const Layout: React.FC = (props) => {
    const data: SiteInfo = useStaticQuery(graphql`
query SiteInfo {
  site {
    siteMetadata {
      linkedin {
        name
        link
      }
      email {
        name
        link
      }
      discord {
        name
        link
      }
      github {
        name
        link
      }
    }
  }
}
    `);
    const discord = data.site?.siteMetadata?.discord?.link as string;
    const email = data.site?.siteMetadata?.email?.link as string;
    const github = data.site?.siteMetadata?.github?.link as string;
    const linkedin = data.site?.siteMetadata?.linkedin?.link as string;

    return (
        <div>
            <nav className={styles.nav}>
                <div className={styles.logo}>LOGO</div>
                <div>
                    <input type="checkbox" id="nav_toggle" />
                    <label htmlFor="nav_toggle" className={styles.hamburger}>&#9776;</label>
                    <div className={styles.nav_menu}>
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/projects">Projects</Link></li>
                        <li><Link to="/contact">Contact</Link></li>
                    </div>
                </div>
            </nav >

            <div className={styles.content}>
                {props.children}
            </div>

            <footer className={styles.footer}>
                <ul>
                    <li className={styles.link}><a href={github}>GitHub</a></li>
                    <li className={styles.link}><a href={linkedin}>LinkedIn</a></li>
                    <li className={styles.link}><a href={discord}>Discord</a></li>
                    <li className={styles.link}><a href={email}>Mail</a></li>
                    <li><p>&#169; 2021</p></li>
                    <li className={styles.emoji}><p>🔗</p></li>
                </ul>
            </footer>
        </div>
    );
}
export default Layout;
