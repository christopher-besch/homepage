import React from "react";
import * as styles from "src/styles/half_element.module.scss";
import * as util_styles from "src/styles/utils.module.scss";
const HalfElement = (props) => {
    return (React.createElement("div", { className: props.full ? undefined : styles.wrapper },
        props.full ? undefined : React.createElement("div", { className: styles.before }),
        React.createElement("div", { className: props.full ? styles.full_element : styles.element }, props.children),
        props.full ? React.createElement("div", { className: util_styles.spacer }) : React.createElement("div", { className: styles.after })));
};
export default HalfElement;
