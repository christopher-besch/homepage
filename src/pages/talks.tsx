import React from "react";
import { graphql, PageProps } from "gatsby";
import Layout from "src/components/layout";
import SEO from "src/components/seo";
import TileList, { gql_talk_to_tile } from "src/components/tile_list";

const Talks = ({ data }: PageProps<Queries.TalksQuery>) => {
    const talks = data.allMdx.edges.map(gql_talk_to_tile);
    return (
        <Layout heading="Talks">
            <TileList tiles={talks} />
        </Layout >
    );
};
export default Talks;

export const query = graphql`
query Talks {
  allMdx(
    sort: {frontmatter: {date: DESC}}
    filter: {frontmatter: {type: {eq: "talk"}, listed: {eq: true}}}
  ) {
    edges {
      node {
        id
        frontmatter {
          description
          title
          link
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
    <SEO heading="Talks" />
);
