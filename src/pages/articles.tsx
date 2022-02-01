import React from "react";
import { Link, graphql } from "gatsby";
import { getImage, GatsbyImage, IGatsbyImageData, ImageDataLike } from "gatsby-plugin-image";
import { ArticlesPage } from "./__generated__/articles-page";

import Layout from "src/components/layout";
import * as styles from "src/styles/articles.module.scss";

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

interface ArticlesProps {
    data: ArticlesPage;
}
const Articles: React.FC<ArticlesProps> = (props) => {
    const articles = props.data.allMdx.edges.map(gql_to_article);
    return (
        <Layout heading="Articles">
            {articles.map(article =>
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
        </Layout >
    );
};
export default Articles;

export const query = graphql`
query ArticlesPage {
  allMdx(
    sort: {fields: frontmatter___date, order: ASC}
    filter: {frontmatter: {type: {eq: "article"}, listed: {eq: true}}}
  ) {
    edges {
      node {
        id
        frontmatter {
          slug
          description
          title
          thumb {
            childImageSharp {
              gatsbyImageData(placeholder: BLURRED)
            }
          }
          date(formatString: "MMMM YYYY")
        }
      }
    }
  }
}
`;
