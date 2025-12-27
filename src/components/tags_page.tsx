import Layout from "./layout.js";
import TagsList from "./tags_list.js";
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
            styleSheets={["always.css"]}
        >
            <Title isHero={false} title="All Tags" />
            <TagsList tags={props.tags.map(([tag, _n]) => tag)} />
        </Layout>
    );
}
