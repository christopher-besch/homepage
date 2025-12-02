import * as mdx from "@mdx-js/mdx";
import * as runtime from "react/jsx-runtime";
import HalfImage from "./half_image.js";
import HalfVideo from "./half_video.js";
import path from "path";
import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";
import rehypeStarryNight from "rehype-starry-night";
import { all as allGrammar } from "@wooorm/starry-night";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeSlug from "rehype-slug";
import { fromHtml } from "hast-util-from-html";
import Quote from "./quote.js";
import HalfElement from "./half_element.js";

// The icon is from Gatsby's gatsby-remark-autolink-headers plugin: https://github.com/gatsbyjs/gatsby/blob/master/packages/gatsby-remark-autolink-headers/src/index.js#L14
// The MIT License (MIT)

// Copyright (c) 2015 Gatsbyjs

// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.
// start of Gatsbyjs copyright
const markdownLinkIcon = `<svg aria-hidden="true" focusable="false" height="16" version="1.1" viewBox="0 0 16 16" width="16"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg>`;
// end of Gatsbyjs copyright

interface MarkdownProps {
    content: string,
    // The path in which the markdown file sits.
    dirPath: string,
}
export default async function Markdown(props: MarkdownProps): Promise<React.ReactNode> {
    // const { default: Markdown } = await mdx.run(await mdx.compile(props.content), runtime);
    const { default: Markdown } = await mdx.evaluate(props.content,
        {
            ...runtime,
            rehypePlugins: [
                rehypeKatex,
                [rehypeStarryNight, { grammars: allGrammar }],
                rehypeSlug,
                [rehypeAutolinkHeadings, {
                    properties: { ariaHidden: true, tabIndex: -1, class: "markdown_heading_a" },
                    // Change the default link icon.
                    content() {
                        return [
                            fromHtml(markdownLinkIcon, { fragment: true }),
                        ];
                    },
                },
                ],
            ],
            remarkPlugins: [
                remarkMath,
            ],
        });

    return <div className="markdown_body" ><Markdown components={{
        HalfImage(imageProps) {
            return <HalfImage inputPath={path.join(props.dirPath, imageProps.src)} full={imageProps.full} alt={imageProps.alt} />;
        },
        HalfVideo(videoProps) {
            return <HalfVideo
                inputPath={path.join(props.dirPath, videoProps.src)}
                width={videoProps.width}
                height={videoProps.height}
                full={videoProps.full}
            />;
        },
        HalfIframe(iframeProps) {
            return <HalfElement full={iframeProps.full}>
                <div className="markdown_iframe_wrapper">
                    <iframe {...iframeProps}></iframe>
                </div>
            </HalfElement>;
        },
        // Clear float.
        Spacer(_spacerProps) {
            return <div className="markdown_spacer" />;
        },
        Quote(quoteProps) {
            return <Quote {...quoteProps} />
        },
    }} />
        {/* Clear the last half element. */}
        <div className="markdown_spacer" />
    </div>;
}
