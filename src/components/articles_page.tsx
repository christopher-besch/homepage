import type { Article } from "../articles.js";
import CardsList from "./cards_list.js";
import Layout from "./layout.js";
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
    return (
        <Layout
            route={props.route}
            title="Chris' Articles"
            styleSheets={["always.css", "default.css"]}>
            <Title isHero={false} title="Articles" />
            <CardsList cards={articlesToShow} />
        </Layout>
    );
}
