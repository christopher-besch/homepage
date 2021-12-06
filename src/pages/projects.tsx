import React from "react";
import { graphql } from "gatsby";
import { PropsWithLocation, with_location } from "../components/with_location";
import { ProjectsPage } from "./__generated__/projects-page";

import Layout from "../components/layout";
import ProjectList, { gql_to_project } from "../components/project_list";
import * as styles from "../styles/projects.module.scss";
import { languages } from "../utils/languages";
import Heading from "src/components/heading";

interface ProjectsProps extends PropsWithLocation {
    data: ProjectsPage;
}
const Projects: React.FC<ProjectsProps> = (props) => {
    const selected_language_id = props.search.language;
    const all_projects = props.data.allMarkdownRemark.edges.map(gql_to_project);
    const selected_language = languages.get(selected_language_id as string);
    if (selected_language)
        return (
            <Layout heading={`${selected_language.name} Projects`} icon={selected_language.icon}>
                <ProjectList projects={all_projects.filter(project => project.languages.includes(selected_language.id))} />
                <Heading heading="Other Projects" />
                <ProjectList projects={all_projects.filter(project => !project.languages.includes(selected_language.id))} />
            </Layout >);
    else return (
        <Layout heading="All Projects">
            <ProjectList projects={all_projects} />
        </Layout >
    );
};
export default with_location(Projects);

export const query = graphql`
query ProjectsPage {
  allMarkdownRemark(sort: {fields: frontmatter___priority, order: ASC}) {
    edges {
      node {
        id
        frontmatter {
          languages
          dependencies
          description
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
