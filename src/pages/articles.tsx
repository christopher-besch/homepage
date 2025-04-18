import React from "react";
import { graphql, PageProps } from "gatsby";
import Layout from "src/components/layout";
import SEO from "src/components/seo";
import TileList, { gql_article_to_tile } from "src/components/tile_list";

const Articles = ({ data }: PageProps<Queries.ArticlesQuery>) => {
    const tiles = data.allMdx.edges.map(gql_article_to_tile);
    return (
        <Layout heading="Articles">
            <TileList tiles={tiles} />
        </Layout >
    );
};
export default Articles;

export const query = graphql`
query Articles {
  allMdx(
    sort: {frontmatter: {date: DESC}}
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
