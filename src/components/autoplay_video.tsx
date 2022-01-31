import React from "react";

import * as styles from "src/styles/video.module.scss";

interface AutoPlayVideoProps {
    src: string;
    poster?: string;
}
const AutoPlayVideo: React.FC<AutoPlayVideoProps> = (props) => {
    return (
        <video className={styles.video} controls loop muted autoPlay width="1920" poster={props.poster}>
            <source src={props.src} type="video/mp4" />
        </video>
    );
}

export default AutoPlayVideo;
