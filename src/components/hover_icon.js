import React from "react";
import * as styles from "src/styles/hover_icon.module.scss";
import get_mask from "src/utils/svg_mask";
const HoverIcon = (props) => {
    const icon = props.icon;
    const alt = props.alt ? props.alt : "icon";
    const icon_mono = props.icon_mono ? props.icon_mono : icon;
    return (React.createElement("div", { className: `${styles.icon_wrapper} ${props.className}` },
        React.createElement("img", { className: `${styles.icon} ${props.icon_class}`, src: icon, alt: alt }),
        React.createElement("div", { className: `${styles.icon_mono} ${props.icon_mono_class}`, style: get_mask(icon_mono) })));
};
export default HoverIcon;
