import React from "react";

import * as styles from "src/styles/video.module.scss";

interface AutoPlayVideoProps {
    src: string;
    poster?: string;
    width?: number;
}
const AutoPlayVideo: React.FC<AutoPlayVideoProps> = (props) => {
    return (
        <div>
            {props.poster ? undefined : <p className={styles.removed_warn}>[video removed from print]</p>}
            {/* show in print version if poster defined */}
            <video className={props.poster ? styles.video : styles.video_no_print} controls loop muted autoPlay poster={props.poster} width={props.width ? props.width : 1920}>
                <source src={props.src} type="video/mp4" />
            </video>
        </div>
    );
}

export default AutoPlayVideo;
