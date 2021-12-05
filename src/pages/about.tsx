import React from "react";
import Layout from "../components/layout";
import * as styles from "../styles/about.module.scss";

const About: React.FC = (props) => {
    return (
        <Layout heading="About">
            <p>I like cheese.</p>
        </Layout>
    );
};
export default About;
