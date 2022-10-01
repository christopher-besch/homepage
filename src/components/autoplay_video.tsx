import React from "react";

import HalfElement from "src/components/half_element"

import * as styles from "src/styles/video.module.scss";

interface AutoPlayVideoProps {
    src: string;
    poster?: string;
    width?: number;
    height?: number;
    // should spread entire width?
    full?: boolean;
}
const AutoPlayVideo = (props: AutoPlayVideoProps) => {
    return (
        <HalfElement full={props.full}>
            {props.poster ? undefined : <p className={styles.removed_warn}>[video removed from print]</p>}
            {/* show in print version if poster defined */}
            <video
                className={props.poster ? styles.video : styles.video_no_print}
                controls loop muted autoPlay
                poster={props.poster}
                width={props.width ? props.width : 1920}
                height={props.height ? props.height : 1080}>
                <source src={props.src} type="video/mp4" />
            </video>
        </HalfElement>
    );
}

export default AutoPlayVideo;
