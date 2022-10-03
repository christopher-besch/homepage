import React from "react";
import Highlight, { defaultProps } from "prism-react-renderer";
import theme from "prism-react-renderer/themes/oceanicNext";

const pre = ({ children }: React.DetailedHTMLProps<React.HTMLAttributes<HTMLPreElement>, HTMLPreElement>) => {
    const class_name = (children as React.ReactElement).props.className || "";
    const matches = class_name.match(/language-(?<lang>.*)/);
    const language = matches && matches.groups && matches.groups.lang
        ? matches.groups.lang
        : "";
    return (
        <Highlight
            {...defaultProps}
            theme={theme}
            code={(children as React.ReactElement).props.children}
            language={language}
        >
            {({ className, style, tokens, getLineProps, getTokenProps }) => (
                <pre className={className} style={style}>
                    {/* for whatever reason an extra line gets added...somewhere, this stupid "fix" remedies the situation */}
                    {tokens.slice(0, -1).map((line, i) => (
                        <div {...getLineProps({ line, key: i })}>
                            {line.map((token, key) => (
                                <span {...getTokenProps({ token, key })} />
                            ))}
                        </div>
                    ))}
                </pre>
            )}
        </Highlight>
    );
};
export default pre;

