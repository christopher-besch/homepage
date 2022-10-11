import React from "react";
import { graphql, PageProps } from "gatsby";
import Layout from "src/components/layout";
import SEO from "src/components/seo";
import ArticleList, { gql_to_article } from "src/components/article_list";

const Articles = ({ data }: PageProps<Queries.ArticlesQuery>) => {
    const articles = data.allMdx.edges.map(gql_to_article);
    return (
        <Layout heading="Articles">
            <ArticleList articles={articles} />
        </Layout >
    );
};
export default Articles;

export const query = graphql`
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

export const Head = () => (
    <SEO heading="Articles" />
);
