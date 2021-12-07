import React from "react";

import * as styles from "src/styles/hover_icon.module.scss";

interface HoverIconProps {
    icon: string;
    icon_mono?: string;
    className?: string;
}
const HoverIcon: React.FC<HoverIconProps> = (props) => {
    const icon = props.icon;
    const icon_mono = props.icon_mono ? props.icon_mono : icon;
    return (
        <div className={`${styles.icon_wrapper} ${props.className}`}>
            <img className={styles.icon} src={icon} />
            <div className={styles.icon_mono} style={{ maskImage: `url(${icon_mono})` }}></div>
        </div>
    );
};
export default HoverIcon;
