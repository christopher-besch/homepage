import React from "react";
import { Link } from "gatsby";
import { getImage, GatsbyImage, IGatsbyImageData, ImageDataLike } from "gatsby-plugin-image";

import * as styles from "src/styles/article_list.module.scss";

export type Article = {
    id: number;
    date: string;
    description: string;
    slug: string;
    title: string;
    thumb: IGatsbyImageData;
}

export function gql_to_article(project: any): Article {
    return {
        id: project.node.id,
        date: project.node.frontmatter?.date,
        description: project.node.frontmatter?.description,
        slug: project.node.frontmatter?.slug,
        title: project.node.frontmatter?.title,
        thumb: getImage(project.node.frontmatter?.thumb as ImageDataLike)!,
    };
}

interface ArticleListProps {
    articles: Article[];
}
const ArticleList: React.FC<ArticleListProps> = (props) => {
    return (
        <div>
            {props.articles.map(article =>
                <Link to={article.slug} key={article.id} className={styles.article}>
                    <GatsbyImage className={styles.image} image={article.thumb} alt="thumbnail" />
                    <div className={styles.body}>
                        <h2 className={styles.heading}>{article.title}</h2>
                        <hr />
                        <div>
                            {article.description.split("\n").map(paragraph =>
                                <p>{paragraph}</p>
                            )}
                        </div>
                    </div>
                </Link>
            )}
        </div>
    );
};
export default ArticleList;

