import React from "react";

import * as styles from "src/styles/half_image.module.scss";

interface HalfImageProps {
    src: string;
}
const HalfImage: React.FC<HalfImageProps> = (props) => {
    return (
        <div className={styles.wrapper}>
            <img
                className={styles.image}
                src={props.src} />
        </div>
    );
}

export default HalfImage;
