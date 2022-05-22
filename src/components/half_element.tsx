import React from "react";

import * as styles from "src/styles/half_element.module.scss";
import * as util_styles from "src/styles/utils.module.scss";

interface HalfElementProps {
    children: React.ReactNode;
    // should spread entire width?
    full?: boolean;
}
const HalfElement: React.FC<HalfElementProps> = (props) => {
    return (
        <div className={props.full ? undefined : styles.wrapper}>
            {props.full ? undefined : <div className={styles.before}></div>}
            <div className={props.full ? styles.full_element : styles.element}>
                {props.children}
            </div>
            {props.full ? <div className={util_styles.spacer}></div> : <div className={styles.after}></div>}
        </div>
    );
}

export default HalfElement;
