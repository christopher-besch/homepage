import React from "react";
import Prism from "prismjs";
// import loadLanguages from "prismjs/components";
import { Highlight } from "prism-react-renderer";

// don't use scss for this becuase the prismjs themes would need to be converted first
// don't use prim-react-renderer themes as they can't light/dark mode switch
import "../styles/code.css";

// this doesn't work for some reason
// import loadLanguages from "prismjs/components/";
// Prism.plugins.autoloader.loadLanguages(["bash", "cpp", "css", "html", "xml", "svg", "python"]);

// see for dependencies: https://raw.githubusercontent.com/PrismJS/prism/master/components.js
require("prismjs/components/prism-bash");
// required by cpp
require("prismjs/components/prism-c");
require("prismjs/components/prism-cpp");
require("prismjs/components/prism-css");
// includes html, xml and svg
require("prismjs/components/prism-markup");
require("prismjs/components/prism-python");
require("prismjs/components/prism-docker");

// reference: https://coffeeaddict.dev/gatsby-mdx-prism/
const PrismSyntaxHighlight = ({ children, className }: React.DetailedHTMLProps<React.HTMLAttributes<HTMLPreElement>, HTMLPreElement>) => {
    const language = className!.replace(/language-/gm, "");

    // children are not a string but TypeScript is unhappy...
    return (
        <Highlight prism={Prism} code={children as string} language={language} theme={{ plain: {}, styles: [] }}>
            {({ className, tokens, getLineProps, getTokenProps }) =>
                <code className={className}>
                    {tokens.slice(0, -1).map((line, i) =>
                        <div key={i} {...getLineProps({ line, key: i })}>
                            {line.map((token, key) =>
                                <span {...getTokenProps({ token, key })} />
                            )}
                        </div>
                    )}
                </code>
            }
        </Highlight>
    );
};

export default PrismSyntaxHighlight;
