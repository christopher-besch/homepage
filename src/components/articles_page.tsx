import type { Article } from "../article.js";
import { getArticleDeployRoute } from "../paths.js";
import Layout from "./layout.js";

interface ArticlesPageProps {
    articles: Article[],
}
export default function ArticlesPage(props: ArticlesPageProps): React.ReactNode {
    return (
        <Layout
            title="Chris' Articles"
            styleSheets={["always.css", "default.css"]}>
            <ul>
                {props.articles.map(article => <li><a href={getArticleDeployRoute(article.slug)}>{article.title}</a></li>)}
            </ul>
        </Layout>
    );
}
