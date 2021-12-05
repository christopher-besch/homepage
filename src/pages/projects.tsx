import React from "react";
import { graphql } from "gatsby";
import { PropsWithLocation, with_location } from "../components/with_location";
import { ProjectsPage } from "./__generated__/projects-page";

import Layout from "../components/layout";
import * as styles from "../styles/projects.module.scss";

interface ProjectsProps extends PropsWithLocation {
    data: ProjectsPage;
}
const Projects: React.FC<ProjectsProps> = (props) => {
    const selected_language = props.search.language;
    const projects = props.data.allMarkdownRemark.edges.map(project => project.node.frontmatter!);
    for (let project of projects) {
        console.log(project.dependencies);
    }
    return (
        <Layout heading="Public Projects">
            <p>
                {selected_language}
            </p>
        </Layout>
    );
};
export default with_location(Projects);

export const query = graphql`
query ProjectsPage {
  allMarkdownRemark(sort: {fields: frontmatter___priority, order: DESC}) {
    edges {
      node {
        frontmatter {
          language
          dependencies
          slug
          title
          thumb {
            childImageSharp {
              gatsbyImageData
            }
          }
        }
      }
    }
  }
}
`;
