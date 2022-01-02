import React from "react";
import Layout from "src/components/layout";

import * as util_styles from "src/styles/utils.module.scss";

const NotFound: React.FC = () =>
    <Layout heading="404 Not Found">
        {/* died because of GDPR */}
        {/* <iframe width="560" height="315" src="https://www.youtube-nocookie.com/embed/2mfi8sTyY30?controls=0" title="YouTube video player" frameBorder="0"></iframe> */}
        <div className={util_styles.main_block}>
            <p>
                Oopsie Woopsie!
                Uwu We made a fucky wucky!!
                A wittle fucko boingo!
                The code monkeys at our headquarters are working VEWY HAWD to fix this!
            </p>
        </div>
    </Layout>;
export default NotFound;
