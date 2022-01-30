import React from "react";

import * as styles from "src/styles/video.module.scss";

interface AutoPlayVideoProps {
    src: any;
}
const AutoPlayVideo: React.FC<AutoPlayVideoProps> = (props) =>
    <video className={styles.video} controls loop muted autoPlay width="1920">
        <source src={props.src} type="video/mp4" />
    </video>

export default AutoPlayVideo;
