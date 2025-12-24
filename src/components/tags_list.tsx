import { Fragment } from "react/jsx-dev-runtime";
import Link from "./link.js";
import { getTagRoute } from "../paths.js";

interface TagsListProps {
    tags: string[],
};
export default function TagsList(props: TagsListProps): React.ReactNode {
    return <div className="markdown_body">
        {props.tags.map((tag, idx) =>
            <Fragment key={idx}> <Link href={getTagRoute(tag)}>#{tag}</Link></Fragment>
        )}
    </div>;
}

