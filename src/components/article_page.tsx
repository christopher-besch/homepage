import type { Article } from "../article.js";
import Layout from "./layout.js";

interface ArticlePageProps {
    article: Article,
}
export default async function ArticlePage(props: React.PropsWithChildren<ArticlePageProps>): Promise<React.ReactNode> {
    return <Layout
        title={props.article.title}
        description={props.article.description}
        styleSheets={["default.css"]}
    >
        {props.article.html}
    </Layout>
}
