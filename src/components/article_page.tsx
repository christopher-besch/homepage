import type { Article } from "../article.js";
import Title from "./title.js";
import Layout from "./layout.js";
import { formatDate } from "../date.js";

interface ArticlePageProps {
    article: Article,
}
export default async function ArticlePage(props: React.PropsWithChildren<ArticlePageProps>): Promise<React.ReactNode> {
    const date = props.article.date != undefined ? formatDate(props.article.date) : undefined;
    let heroImage: any = undefined;
    if (props.article.hero != undefined) {
        heroImage = {
            inputPath: props.article.hero.inputPath,
            // Setting this too low makes the image jump when switching between landscape and portrait.
            heightFraction: 0.7,
            objectFitHorizontal: props.article.hero.horizontalPosition,
            objectFitVertical: props.article.hero.verticalPosition,
            children: <Title isHero={true} title={props.article.title} subtitle={date} />,
        };
    }
    return <Layout
        title={props.article.title}
        description={props.article.description}
        styleSheets={["always.css", "article.css"]}
        heroImage={heroImage}
    >
        {props.article.hero == undefined ? <Title isHero={false} title={props.article.title} subtitle={date} /> : undefined}
        <div className="article_page_markdown">{props.article.reactNode}</div>
    </Layout>
}
