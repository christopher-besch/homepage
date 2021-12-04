import React from "react";
import Layout from "../components/layout";
import Heading from "../components/heading";
import * as styles from "../styles/home.module.css";

const Home: React.FC = () => {
    return (
        <Layout>
            <Heading>
                <h1>Christopher Besch</h1>
                <h2>Software Developer - Problem Solver</h2>
                <hr />
            </Heading>
            <div className={styles.projects}>
                <div className={styles.project}>
                    <div className={styles.content}>
                        <img src="https://www.w3schools.com/w3images/lights.jpg" alt="broken image" style={{ width: "100%" }} />
                        <h3>My Work</h3>
                        <p>I like cheese</p>
                    </div>
                </div>
                <div className={styles.project}>
                    <div className={styles.content}>
                        <img src="https://www.w3schools.com/w3images/lights.jpg" alt="broken image" style={{ width: "100%" }} />
                        <h3>My Work</h3>
                        <p>I like cheese</p>
                    </div>
                </div>
                <div className={styles.project}>
                    <div className={styles.content}>
                        <img src="https://www.w3schools.com/w3images/lights.jpg" alt="broken image" style={{ width: "100%" }} />
                        <h3>My Work</h3>
                        <p>I like cheese</p>
                    </div>
                </div>
                <div className={styles.project}>
                    <div className={styles.content}>
                        <img src="https://www.w3schools.com/w3images/lights.jpg" alt="broken image" style={{ width: "100%" }} />
                        <h3>My Work</h3>
                        <p>I like cheese</p>
                    </div>
                </div>
            </div>
        </Layout >
    )
};
export default Home;
