import * as mdx from "@mdx-js/mdx";
import * as fs from "fs";
import * as runtime from "react/jsx-runtime";

interface MarkdownProps {
    path: string,
}
export default function Markdown(props: MarkdownProps): React.ReactNode {
    const file = fs.readFileSync(props.path);
    const { default: Markdown } = mdx.evaluateSync(file, runtime);
    return <Markdown />;
}
