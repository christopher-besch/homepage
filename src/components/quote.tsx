import React from "react";

interface QuoteProps {
    text: string;
    author: string;
}
const Quote = (props: QuoteProps) => {
    return (
        <blockquote>
            <center>
                <em>"{props.text}"</em>  —{props.author}
            </center>
        </blockquote>
    );
}

export default Quote;
