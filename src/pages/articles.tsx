import React from "react";
import { graphql } from "gatsby";
import Layout from "src/components/layout";
import ArticleList, { gql_to_article } from "src/components/article_list";
import { ArticlesPage } from "./__generated__/articles-page";

interface ArticlesProps {
    data: ArticlesPage;
}
const Articles: React.FC<ArticlesProps> = (props) => {
    const articles = props.data.allMdx.edges.map(gql_to_article);
    return (
        <Layout heading="Articles">
            <ArticleList articles={articles} />
        </Layout >
    );
};
export default Articles;

export const query = graphql`
query ArticlesPage {
  allMdx(
    sort: {fields: frontmatter___date, order: DESC}
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
