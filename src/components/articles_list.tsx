import type { Article } from "../article.js";
import { formatDate } from "../date.js";
import { getArticleDeployRoute } from "../paths.js";
import Image from "./image.js";

interface ArticlesListProps {
    articles: Article[],
}
export default function ArticlesList(props: ArticlesListProps): React.ReactNode {
    return (
        <div className="articles_list">
            {props.articles.map((article, i) =>
                <a key={i} className="articles_list_card" href={getArticleDeployRoute(article.slug)}>
                    <Image inputPath={article.banner!} lazy={true} />
                    <h1>{article.title}</h1>
                    {article.date != undefined ?
                        <h2>{formatDate(article.date)}</h2>
                        : undefined}
                    <hr />
                    <p>{article.description}</p>
                </a>
            )}
        </div>
    );
}
