import React from "react";

import HalfElement from "src/components/half_element"

import * as styles from "src/styles/iframe.module.scss";

interface IframeProps {
    src: string;
    title?: string;
}
const Iframe: React.FC<IframeProps> = (props) => {
    return (
        <HalfElement full={true}>
            <div className={styles.wrapper}>
                <iframe className={styles.iframe} src={props.src} title={props.title}></iframe>
            </div>
        </HalfElement>
    );
}

export default Iframe;
