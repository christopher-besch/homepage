import { getNearestListedNeighbours, type Article } from "../article.js";
import Title from "./title.js";
import Layout from "./layout.js";
import { formatDate } from "../date.js";
import ArticlesList from "./articles_list.js";

const heroHeightFraction = 0.7;
const nearestNeighbours = 2;
const antiNeighbours = 2;

interface ArticlePageProps {
    articles: Article[],
    idx: number;
}
export default async function ArticlePage(props: ArticlePageProps): Promise<React.ReactNode> {
    const article = props.articles[props.idx]!;
    const date = article.date != undefined ? formatDate(article.date) : undefined;
    let heroImage: any = undefined;
    if (article.hero != undefined) {
        heroImage = {
            inputPath: article.hero.inputPath,
            // Setting this too low makes the image jump when switching between landscape and portrait.
            heightFraction: heroHeightFraction,
            objectFitHorizontal: article.hero.horizontalPosition,
            objectFitVertical: article.hero.verticalPosition,
            children: <Title isHero={true} title={article.title} subtitle={date} />,
        };
    }
    const similarArticles = getNearestListedNeighbours(props.idx, nearestNeighbours, antiNeighbours, props.articles);
    return <Layout
        title={article.title}
        description={article.description}
        styleSheets={["always.css", "article.css"]}
        heroImage={heroImage}
    >
        {article.hero == undefined ? <Title isHero={false} title={article.title} subtitle={date} /> : undefined}
        <div className="article_page_markdown">{article.reactNode}</div>
        <Title isHero={false} title="Other Articles" />
        <ArticlesList articles={similarArticles} />
    </Layout>
}
