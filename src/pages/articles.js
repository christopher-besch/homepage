import React from "react";
import { graphql } from "gatsby";
import Layout from "src/components/layout";
import ArticleList, { gql_to_article } from "src/components/article_list";
const Articles = ({ data }) => {
    const articles = data.allMdx.edges.map(gql_to_article);
    return (React.createElement(Layout, { heading: "Articles" },
        React.createElement(ArticleList, { articles: articles })));
};
export default Articles;
export const query = graphql `
query Articles {
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
