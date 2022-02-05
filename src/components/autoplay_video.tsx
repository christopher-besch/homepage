import React from "react";

import * as styles from "src/styles/video.module.scss";

interface AutoPlayVideoProps {
    src: string;
    poster?: string;
    width?: number;
    height?: number;
}
const AutoPlayVideo: React.FC<AutoPlayVideoProps> = (props) => {
    return (
        <div className={styles.wrapper}>
            {props.poster ? undefined : <p className={styles.removed_warn}>[video removed from print]</p>}
            {/* show in print version if poster defined */}
            <video
                controls loop muted autoPlay
                className={props.poster ? styles.video : styles.video_no_print}
                poster={props.poster}
                width={props.width ? props.width : 1920}
                height={props.height ? props.height : 1080}>
                <source src={props.src} type="video/mp4" />
            </video>
        </div>
    );
}

export default AutoPlayVideo;
