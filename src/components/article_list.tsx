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

export function gql_to_article(article: any): Article {
    return {
        id: article.node.id,
        date: article.node.frontmatter?.date,
        description: article.node.frontmatter?.description,
        slug: article.node.frontmatter?.slug,
        title: article.node.frontmatter?.title,
        thumb: getImage(article.node.frontmatter?.thumb as ImageDataLike)!,
    };
}

interface ArticleListProps {
    articles: Article[];
    className?: string;
}
const ArticleList = (props: ArticleListProps) => {
    return (
        <div className={props.className}>
            {props.articles.map(article =>
                <Link to={`/articles/${article.slug}`} key={article.id} className={styles.article}>
                    <div className={styles.image}>
                        <GatsbyImage image={article.thumb} alt="thumbnail" />
                    </div>
                    <div className={styles.body}>
                        <div>
                            <h2 className={styles.heading}>{article.title}</h2>
                            <hr />
                            <div>
                                {article.description.split("\n").map((paragraph, idx) =>
                                    <p key={idx}>{paragraph}</p>
                                )}
                            </div>
                        </div>

                        <p className={styles.date}>{article.date}</p>
                    </div>
                </Link>
            )}
        </div>
    );
};
export default ArticleList;

