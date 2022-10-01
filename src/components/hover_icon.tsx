import React from "react";

import * as styles from "src/styles/hover_icon.module.scss";
import get_mask from "src/utils/svg_mask";

interface HoverIconProps {
    icon: string;
    alt?: string;
    icon_mono?: string;
    className?: string;
    // used to add hover effect to out-of-scope elements
    icon_class?: string;
    icon_mono_class?: string;
}
const HoverIcon = (props: HoverIconProps) => {
    const icon = props.icon;
    const alt = props.alt ? props.alt : "icon";
    const icon_mono = props.icon_mono ? props.icon_mono : icon;
    return (
        <div className={`${styles.icon_wrapper} ${props.className}`}>
            <img
                className={`${styles.icon} ${props.icon_class}`}
                src={icon}
                alt={alt}
            />
            <div
                className={`${styles.icon_mono} ${props.icon_mono_class}`}
                style={get_mask(icon_mono)}
            ></div>
        </div>
    );
};
export default HoverIcon;
