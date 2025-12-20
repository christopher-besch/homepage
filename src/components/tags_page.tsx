import { toTitleCase } from "../conversion.js";
import { getTagRoute } from "../paths.js";
import Layout from "./layout.js";
import Link from "./link.js";
import Title from "./title.js";

interface TagsPageProps {
    route: string,
    tags: [string, number][],
}
// This is a page noone links to.
export default function TagsPage(props: TagsPageProps): React.ReactNode {
    return (
        <Layout
            route={props.route}
            title="Tags"
            styleSheets={["always.css", "article.css"]}
        >
            <Title isHero={false} title="All Tags" />
            <div className="markdown_body">
                {props.tags.map(([tag, num], idx) =>
                    <h6 key={idx}><Link href={getTagRoute(tag)}>{toTitleCase(tag)} ({num})</Link></h6>
                )}
            </div>
        </Layout>
    );
}
