import React from "react";
import { useStaticQuery, graphql } from "gatsby";
import HalfElement from "src/components/half_element";
import * as styles from "src/styles/iframe.module.scss";
const Iframe = (props) => {
    // since Gatsby doesn't support a clean way of automatically determining these types, they have to be defined manually
    const data = useStaticQuery(graphql `
query IframeData {
  site {
    siteMetadata {
      present_url
    }
  }
}
    `);
    // xor
    if ((props.src == undefined) == (props.present == undefined))
        throw new Error("Iframe needs src or present parameter");
    // TODO: check type
    const present_url = data.site.siteMetadata.present_url;
    const src = props.present ? `${present_url}/${props.present}` : props.src;
    return (React.createElement(HalfElement, { full: true },
        React.createElement("div", { className: styles.wrapper },
            React.createElement("iframe", { className: styles.iframe, src: src, title: props.title, allowFullScreen: props.fullscreen }))));
};
export default Iframe;
