import type { Article } from "../articles.js";
import { sortTags } from "../tags.js";
import CardsList from "./cards_list.js";
import Layout from "./layout.js";
import TagsList from "./tags_list.js";
import Title from "./title.js";

interface ArticlesPageProps {
    route: string,
    articles: Article[],
}
export default function ArticlesPage(props: ArticlesPageProps): React.ReactNode {
    const articlesToShow = props.articles
        .filter(a => a.listed)
        // Date must be defined for all listed articles.
        .sort((a, b) => b.date!.getTime() - a.date!.getTime());
    const allTags = articlesToShow.flatMap(p => p.tags);
    const tagsList = sortTags(allTags).slice(0, 10);
    return (
        <Layout
            route={props.route}
            title="Chris' Articles"
            styleSheets={["always.css", "default.css"]}>
            <Title isHero={false} title="Articles" />
            <TagsList tags={tagsList.map(([tag, _n]) => tag)} />
            <CardsList cards={articlesToShow} />
        </Layout>
    );
}
