import React from "react";

import HalfElement from "src/components/half_element"

import * as styles from "src/styles/half_image.module.scss";

interface HalfImageProps {
    src: string;
    // should spread entire width?
    full?: boolean;
}
const HalfImage: React.FC<HalfImageProps> = (props) => {
    return (
        <HalfElement full={props.full}>
            <img className={styles.image} src={props.src} />
        </HalfElement>
    );
}

export default HalfImage;
