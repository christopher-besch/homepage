import React from "react";
import HalfElement from "src/components/half_element";
import * as styles from "src/styles/half_image.module.scss";
const HalfImage = (props) => {
    return (React.createElement(HalfElement, { full: props.full },
        React.createElement("img", { className: styles.image, src: props.src })));
};
export default HalfImage;
