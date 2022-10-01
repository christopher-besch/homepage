import React from "react";
import Layout from "src/components/layout";
import * as util_styles from "src/styles/utils.module.scss";
const NotFound = ({}) => React.createElement(Layout, { heading: "404 Not Found" },
    React.createElement("div", { className: util_styles.main_block },
        React.createElement("p", null, "Oopsie Woopsie! Uwu We made a fucky wucky!! A wittle fucko boingo! The code monkeys at our headquarters are working VEWY HAWD to fix this!")));
export default NotFound;
