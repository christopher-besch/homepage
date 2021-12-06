import React from "react";
import { graphql } from "gatsby";
import { PropsWithLocation, with_location } from "../components/with_location";
import { ProjectsPage } from "./__generated__/projects-page";

import Layout from "../components/layout";
import * as styles from "../styles/projects.module.scss";
import { languages } from "../utils/languages";

interface ProjectsProps extends PropsWithLocation {
    data: ProjectsPage;
}
const Projects: React.FC<ProjectsProps> = (props) => {
    const selected_language_id = props.search.language;
    const all_projects = props.data.allMarkdownRemark.edges.map(project => project.node.frontmatter!);
    const selected_language = languages.get(selected_language_id as string);
    return (
        <Layout heading={selected_language ? `${selected_language.name} Projects` : `Projects`} icon={selected_language ? selected_language.icon : undefined}>
        </Layout >
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
