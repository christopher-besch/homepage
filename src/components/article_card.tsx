import type { Article } from "../article.js";
import { formatDate } from "../date.js";
import { getArticleDeployRoute } from "../paths.js";

interface ArticleCardProps {
    article: Article,
}
export default function ArticleCard(props: ArticleCardProps): React.ReactNode {
    return <div>
        <a href={getArticleDeployRoute(props.article.slug)}>{props.article.title}
            {props.article.date != undefined ?
                <span>— {formatDate(props.article.date)}</span>
                : undefined}
        </a>
        <br />
        <br />
    </div>
}
