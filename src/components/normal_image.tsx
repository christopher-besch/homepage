import React from "react";

import * as styles from "src/styles/normal_image.module.scss";

interface NormalImageProps {
    src: string;
}
const NormalImage: React.FC<NormalImageProps> = (props) => {
    return (
        <img
            className={styles.image}
            src={props.src} />
    );
}

export default NormalImage;
