import React from "react";

import * as styles from "src/styles/half_image.module.scss";

interface HalfImageProps {
    src: string;
    // TODO: could also be added to videos
    // should spread entire width?
    full?: boolean;
}
const HalfImage: React.FC<HalfImageProps> = (props) => {
    return (
        <div className={styles.wrapper}>
            <img
                className={props.full ? styles.full_image : styles.image}
                src={props.src} />
        </div>
    );
}

export default HalfImage;
