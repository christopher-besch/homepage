import React from "react";
import { Link, graphql } from "gatsby";
import { ProjectsPage } from "./__generated__/projects-page";

import { PropsWithLocation, with_location } from "src/utils/with_location";
import Layout from "src/components/layout";
import ProjectList, { gql_to_project } from "src/components/project_list";
import * as styles from "src/styles/projects.module.scss";
import * as util_styles from "src/styles/utils.module.scss";
import { max_priority_list_default, max_priority_list_all } from "src/utils/consts";

interface ProjectsProps extends PropsWithLocation {
    data: ProjectsPage;
}
const Projects: React.FC<ProjectsProps> = (props) => {
    const max_priority = props.search.max_priority != null ? parseInt(props.search.max_priority as string) : max_priority_list_default;
    const all_projects = props.data.allMarkdownRemark.edges.map(gql_to_project);
    const projects = all_projects.filter(project => project.priority <= max_priority);

    return (
        <Layout heading={max_priority >= max_priority_list_all ? "All Projects" : "Projects"}>
            <ProjectList className={styles.projects} projects={projects} />
            {max_priority < max_priority_list_all ? <Link className={`${util_styles.block} ${util_styles.link}`} to={`/projects?max_priority=${max_priority_list_all}`}>Show All</Link> : undefined}
        </Layout >
    );
};
export default with_location(Projects);

export const query = graphql`
query ProjectsPage {
  allMarkdownRemark(
    sort: {fields: frontmatter___priority, order: ASC},
    filter: {frontmatter: {type: {eq: "project"}}}
  ) {
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
