import * as mdx from "@mdx-js/mdx";
import * as runtime from "react/jsx-runtime";

interface MarkdownProps {
    content: string,
}
export default async function Markdown(props: MarkdownProps): Promise<React.ReactNode> {
    const { default: Markdown } = await mdx.evaluate(props.content, runtime);

    return <Markdown />;
}
