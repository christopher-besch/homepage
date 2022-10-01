import React from "react";
import { useStaticQuery, graphql } from "gatsby";

import HalfElement from "src/components/half_element"
import { IframeData } from "./__generated__/iframe-data";

import * as styles from "src/styles/iframe.module.scss";

interface IframeProps {
    src?: string;
    present?: string;
    title?: string;
    fullscreen?: boolean;
}
const Iframe: React.FC<IframeProps> = (props) => {
//     const data: IframeData = useStaticQuery(graphql`
// query IframeData {
//   site {
//     siteMetadata {
//       present_url
//     }
//   }
// }
//     `);
    // xor
    if ((props.src == undefined) == (props.present == undefined))
        throw new Error("Iframe needs src or present parameter");
    // TODO: check type
    // const present_url = data.site?.siteMetadata?.present_url;
    const present_url = "https://example.com";
    const src = props.present ? `${data.site?.siteMetadata?.present_url}/${props.present}` : props.src;
    return (
        <HalfElement full={true}>
            <div className={styles.wrapper}>
                <iframe className={styles.iframe} src={src} title={props.title} allowFullScreen={props.fullscreen}></iframe>
            </div>
        </HalfElement>
    );
}

export default Iframe;

