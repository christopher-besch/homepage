import React from "react";

import * as styles from "src/styles/heading.module.scss";
import get_mask from "src/utils/svg_mask";

interface HeadingProps {
    heading: string;
    sub_heading?: string;
    icon?: string;
    className?: string;
}
const Heading = (props: HeadingProps) =>
    <div className={`${styles.heading} ${props.className}`}>
        <h1>
            {props.heading}
            {props.icon ? <span className={styles.icon} style={get_mask(props.icon)}></span> : undefined}
        </h1>
        <span className={styles.sub_heading}>{props.sub_heading}</span>
        <hr />
    </div>

export default Heading;

