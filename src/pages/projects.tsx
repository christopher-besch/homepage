import React from "react";
import { Link, graphql } from "gatsby";
import { ProjectsPage } from "./__generated__/projects-page";

import { PropsWithLocation, with_location } from "src/components/with_location";
import Layout from "src/components/layout";
import ProjectList, { gql_to_project } from "src/components/project_list";
import * as styles from "src/styles/projects.module.scss";
import { languages } from "src/utils/languages";
import Heading from "src/components/heading";

interface ProjectsProps extends PropsWithLocation {
    data: ProjectsPage;
}
const Projects: React.FC<ProjectsProps> = (props) => {
    const selected_language_id = props.search.language;
    const max_priority = props.search.max_priority != null ? parseInt(props.search.max_priority as string) : 5;
    const all_projects = props.data.allMarkdownRemark.edges.map(gql_to_project);
    const projects = all_projects.filter(project => project.priority <= max_priority);
    const selected_language = languages.get(selected_language_id as string);

    if (selected_language)
        return (
            <Layout heading={`${selected_language.name} Projects`} icon={selected_language.icon_mono}>
                <ProjectList projects={all_projects.filter(project => project.languages.includes(selected_language))} />
                <Heading heading="Other Projects" />
                <ProjectList projects={projects.filter(project => !project.languages.includes(selected_language))} />
            </Layout >);
    else return (
        <Layout heading={`${max_priority >= 100 ? "All " : ""}Projects`}>
            <ProjectList projects={projects} />
            {max_priority < 100 ? <Link className={styles.link} to="/projects?max_priority=100">Show All</Link> : undefined}
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
          priority
          dependencies
          slug
          description
          title
          thumb {
            childImageSharp {
              gatsbyImageData (
                placeholder: BLURRED
              )
            }
          }
          date(formatString: "MMMM YYYY")
        }
      }
    }
  }
}
`;
