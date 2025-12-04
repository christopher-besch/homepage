import type { Article } from "../article.js";
import ArticleCard from "./article_card.js";

interface ArticlesListProps {
    articles: Article[],
}
export default function ArticlesList(props: ArticlesListProps): React.ReactNode {
    return (
        <div>
            {props.articles.map(article => <ArticleCard article={article} />)}
        </div>
    );
}
