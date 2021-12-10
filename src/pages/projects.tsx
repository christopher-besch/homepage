import React from "react";
import { Link, graphql } from "gatsby";
import { ProjectsPage } from "./__generated__/projects-page";

import { PropsWithLocation, with_location } from "src/utils/with_location";
import Layout from "src/components/layout";
import ProjectList, { gql_to_project } from "src/components/project_list";
import * as styles from "src/styles/projects.module.scss";

interface ProjectsProps extends PropsWithLocation {
    data: ProjectsPage;
}
const Projects: React.FC<ProjectsProps> = (props) => {
    const max_priority = props.search.max_priority != null ? parseInt(props.search.max_priority as string) : 5;
    const all_projects = props.data.allMarkdownRemark.edges.map(gql_to_project);
    const projects = all_projects.filter(project => project.priority <= max_priority);

    return (
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
          link
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
