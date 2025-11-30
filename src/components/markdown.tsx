import * as mdx from "@mdx-js/mdx";
import * as runtime from "react/jsx-runtime";

interface MarkdownProps {
    content: string,
}
export default async function Markdown(props: MarkdownProps): Promise<React.ReactNode> {
    // const { default: Markdown } = await mdx.run(await mdx.compile(props.content), runtime);
    const { default: Markdown } = await mdx.evaluate(props.content,
        {
            ...runtime,
        });

    return <Markdown components={{
        HalfImage(_props) {
            // TODO: use the real thing.
            return <hr />;
        },
    }} />;
}
