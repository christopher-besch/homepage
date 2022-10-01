import React from "react";
import * as styles from "src/styles/sub_heading.module.scss";
const SubHeading = (props) => React.createElement("div", { className: `${styles.sub_heading} ${props.className}` },
    React.createElement("h1", null, props.heading),
    React.createElement("hr", null));
export default SubHeading;
