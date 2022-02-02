import React from "react";

import * as styles from "src/styles/video.module.scss";

interface AutoPlayVideoProps {
    src: string;
    poster?: string;
}
const AutoPlayVideo: React.FC<AutoPlayVideoProps> = (props) => {
    return (
        <div>
            {props.poster ? undefined : <p className={styles.removed_warn}>[video removed from print]</p>}
            {/* show in print version if poster defined */}
            <video className={props.poster ? styles.video : styles.video_no_print} controls loop muted autoPlay width="1920" poster={props.poster}>
                <source src={props.src} type="video/mp4" />
            </video>
        </div>
    );
}

export default AutoPlayVideo;
