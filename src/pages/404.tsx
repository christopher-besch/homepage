import React from "react";
import Layout from "../components/layout";

const NotFound: React.FC = () =>
    <Layout heading="404 Not Found">
        <p style={{ marginBottom: "10px" }}>What an error message should not look like:</p>
        <iframe width="560" height="315" src="https://www.youtube-nocookie.com/embed/2mfi8sTyY30?controls=0" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"></iframe>
    </Layout>;
export default NotFound;
