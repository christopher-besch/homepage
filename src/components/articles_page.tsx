import type { Article } from "../article.js";
import ArticlesList from "./articles_list.js";
import Layout from "./layout.js";
import Title from "./title.js";

interface ArticlesPageProps {
    articles: Article[],
}
export default function ArticlesPage(props: ArticlesPageProps): React.ReactNode {
    const articlesToShow = props.articles
        .filter(a => a.listed)
        // Date must be defined for all listed articles.
        .sort((a, b) => b.date!.getTime() - a.date!.getTime());
    return (
        <Layout
            title="Chris' Articles"
            styleSheets={["always.css", "default.css"]}>
            <Title isHero={false} title="Articles" />
            <ArticlesList articles={articlesToShow} />
        </Layout>
    );
}
