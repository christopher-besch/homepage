import React from "react";

import * as styles from "src/styles/sub_heading.module.scss";

interface HeadingProps {
    heading: string;
    className?: string;
}
const SubHeading: React.FC<HeadingProps> = (props) =>
    <div className={`${styles.sub_heading} ${props.className}`}>
        <h1>
            {props.heading}
        </h1>
        <hr />
    </div>

export default SubHeading;
