import React from "react";

import Layout from "src/components/layout";
import * as util_styles from "src/styles/utils.module.scss";

const Articles: React.FC = (props) => {
    return (
        <Layout heading="Articles">
            <div className={util_styles.main_block}>
                Coming Soon.
            </div>
        </Layout >
    );
};
export default Articles;
