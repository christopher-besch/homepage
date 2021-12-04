import React from "react";
import "../styles/global.css";
import * as styles from "../styles/layout.module.css";

const Layout: React.FC = (props) =>
    <div className={styles.layout}>
        <nav className={styles.nav}>
            <div>LOGO</div>
            <div className={styles.nav_links}>
                <input type="checkbox" id="nav_toggle" />
                <label htmlFor="nav_toggle" className={styles.hamburger}>&#9776;</label>
                <div className={styles.nav_menu}>
                    <li><a href="#">Home</a></li>
                    <li><a href="#">Home</a></li>
                    <li><a href="#">Home</a></li>
                    <li><a href="#">Home</a></li>
                    <li><a href="#">Home</a></li>
                </div>
            </div>
        </nav >

        <div className={styles.content}>
            {props.children}
        </div>

        <footer className={styles.footer}>
            <ul>
                <li><a href="#">Twitter</a></li>
                <li><a href="#">Twitter</a></li>
                <li><a href="#">Twitter</a></li>
                <li><a href="#">Twitter</a></li>
                <li><a href="#">Twitter</a></li>
                <li>
                    <p>🔗</p>
                </li>
            </ul>
        </footer>
    </div>;
export default Layout;
