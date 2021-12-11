import React from "react";

import * as styles from "src/styles/heading.module.scss";

interface HeadingProps {
    heading: string;
    sub_heading?: string;
    icon?: string;
}
const Heading: React.FC<HeadingProps> = (props) =>
    <div className={styles.heading}>
        <h1>
            {props.heading}
            {props.icon ? <span className={styles.icon} style={{ maskImage: `url(${props.icon})` }}></span> : undefined}
        </h1>
        <span className={styles.sub_heading}>{props.sub_heading}</span>
        <hr />
    </div>

export default Heading;
