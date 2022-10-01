import React from "react";
import HalfElement from "src/components/half_element";
import * as styles from "src/styles/video.module.scss";
const AutoPlayVideo = (props) => {
    return (React.createElement(HalfElement, { full: props.full },
        props.poster ? undefined : React.createElement("p", { className: styles.removed_warn }, "[video removed from print]"),
        React.createElement("video", { className: props.poster ? styles.video : styles.video_no_print, controls: true, loop: true, muted: true, autoPlay: true, poster: props.poster, width: props.width ? props.width : 1920, height: props.height ? props.height : 1080 },
            React.createElement("source", { src: props.src, type: "video/mp4" }))));
};
export default AutoPlayVideo;
