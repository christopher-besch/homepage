import * as mdx from "@mdx-js/mdx";
import * as runtime from "react/jsx-runtime";
import HalfImage from "./half_image.js";
import HalfVideo from "./half_video.js";
import path from "path";
import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";

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
            // TODO: add fonts
            rehypePlugins: [rehypeKatex],
            remarkPlugins: [remarkMath],
        });

    return <Markdown components={{
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
        // Clear float.
        Spacer(_spacerProps) {
            return <div className="markdown_spacer" />;
        },
    }} />;
}
