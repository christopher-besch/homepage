import { type Article } from "../articles.js";
import Title from "./title.js";
import Layout from "./layout.js";
import { formatDate } from "../date.js";
import CardsList from "./cards_list.js";
import Button from "./button.js";
import { getNearestListedNeighbours } from "../embedding.js";
import { loadArticlesPath } from "../paths.js";
import ReactTo from "./react_to.js";

const heroHeightFraction = 0.7;
const nearestNeighbours = 2;
const antiNeighbours = 2;

interface ArticlePageProps {
    route: string,
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
        route={props.route}
        banner={article.banner}
        title={article.title}
        description={article.description}
        styleSheets={["always.css", "article.css"]}
        heroImage={heroImage}
        date={article.date}
    >
        {article.hero == undefined ? <Title isHero={false} title={article.title} subtitle={date} /> : undefined}
        <div className="article_page_markdown">{article.reactNode}</div>
        <ReactTo route={props.route} />
        <Title isHero={false} title="Other Articles" />
        <CardsList cards={similarArticles} />
        <Button href={loadArticlesPath} text="Furthermore Articles" />
    </Layout>
}
