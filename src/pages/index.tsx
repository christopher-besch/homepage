import React from "react";
import { graphql, Link } from "gatsby";
import { HomePage } from "./__generated__/home-page";

import Layout from "../components/layout";
import ProjectList, { gql_to_project } from "../components/project_list";
import * as styles from "../styles/home.module.scss";

interface HomeProps {
    data: HomePage
}
const Home: React.FC<HomeProps> = (props) => {
    const projects = props.data.allMarkdownRemark.edges.map(gql_to_project);

    return (
        <Layout heading="Flagship Projects">
            <ProjectList projects={projects} />
        </Layout >
    )
};
export default Home;

export const query = graphql`
query HomePage {
  allMarkdownRemark(
    filter: {frontmatter: {priority: {gte: 0, lte: 1}}}
    sort: {fields: frontmatter___priority, order: ASC}
  ) {
    edges {
      node {
        id
        frontmatter {
          languages
          dependencies
          slug
          description
          title
          thumb {
            childImageSharp {
              gatsbyImageData(
                placeholder: BLURRED
              )
            }
          }
        }
      }
    }
  }
}
`;
