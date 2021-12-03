import React from "react";
import Layout from "../components/layout";
import * as styles from "../styles/home.module.css";

const Home: React.FC = () => {
    return (
        <Layout>
            <div className={styles.portfolio}>
                <p>Christopher Besch</p>
                <hr />
                <h2>Portfolio</h2>
                <p>Little info</p>
            </div>
        </Layout>
    )
};
export default Home;
