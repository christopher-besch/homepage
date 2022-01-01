import React from "react";

import Layout from "src/components/layout";
import * as styles from "src/styles/articles.module.scss";
import * as util_styles from "src/styles/utils.module.scss";

const Articles: React.FC = (props) => {
    return (
        <Layout heading="Articles">
            <div className={styles.block} >
                <div className={util_styles.block}>
                    Coming Soon.
                </div>
            </div >
        </Layout >
    );
};
export default Articles;
