import type { Article } from "../article.js";
import Title from "./title.js";
import Layout from "./layout.js";

interface ArticlePageProps {
    article: Article,
}
export default async function ArticlePage(props: React.PropsWithChildren<ArticlePageProps>): Promise<React.ReactNode> {
    let heroImage: any = undefined;
    if (props.article.hero != undefined) {
        heroImage = {
            inputPath: props.article.hero.inputPath,
            // Setting this too low makes the image jump when switching between landscape and portrait.
            heightFraction: 0.7,
            objectFitHorizontal: props.article.hero.horizontalPosition,
            objectFitVertical: props.article.hero.verticalPosition,
            children: <Title isHero={true} title={props.article.title} subtitle="25th January 2025 todo" />,
        };
    }
    return <Layout
        title={props.article.title}
        description={props.article.description}
        styleSheets={["always.css", "article.css"]}
        heroImage={heroImage}
    >
        {props.article.hero == undefined ? <Title isHero={false} title={props.article.title} subtitle="25th January 2025 todo" /> : undefined}
        <div className="article_page_markdown">{props.article.html}</div>
    </Layout>
}
