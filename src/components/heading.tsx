import React from "react";

import * as styles from "../styles/heading.module.css";

const Heading: React.FC = (props) =>
    <div className={styles.heading}>
        {props.children}
    </div>
export default Heading;
