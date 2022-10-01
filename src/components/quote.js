import React from "react";
const Quote = (props) => {
    return (React.createElement("blockquote", null,
        React.createElement("center", null,
            React.createElement("em", null,
                "\"",
                props.text,
                "\""),
            "  \u2014",
            props.author)));
};
export default Quote;
