import React from "react";

import * as styles from "src/styles/half_element.module.scss";

interface HalfElementProps {
    children?: React.ReactNode;
    // should spread entire width?
    full?: boolean;
}
const HalfElement: React.FC<HalfElementProps> = (props) => {
    return (
        <div className={props.full ? styles.full_wrapper : styles.wrapper}>
            <div className={styles.before}></div>
            <div className={props.full ? styles.full_element : styles.element}>
                {props.children}
            </div>
            <div className={styles.after}></div>
        </div>
    );
}

export default HalfElement;
