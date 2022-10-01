import React from "react";
import * as styles from "src/styles/heading.module.scss";
import get_mask from "src/utils/svg_mask";
const Heading = (props) => React.createElement("div", { className: `${styles.heading} ${props.className}` },
    React.createElement("h1", null,
        props.heading,
        props.icon ? React.createElement("span", { className: styles.icon, style: get_mask(props.icon) }) : undefined),
    React.createElement("span", { className: styles.sub_heading }, props.sub_heading),
    React.createElement("hr", null));
export default Heading;
