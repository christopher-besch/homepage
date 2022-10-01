import React from "react";
import { Link, graphql } from "gatsby";
import Layout from "src/components/layout";
import ProjectList, { gql_to_project } from "src/components/project_list";
import * as util_styles from "src/styles/utils.module.scss";
import { max_priority_list_default, max_priority_list_all } from "src/utils/consts";
const Projects = ({ data, location }) => {
    const max_priority_raw = new URL(location.href).searchParams.get("max_priority");
    const max_priority = max_priority_raw != null ? parseInt(max_priority_raw) : max_priority_list_default;
    const all_projects = data.allMdx.edges.map(gql_to_project);
    const projects = all_projects.filter(project => project.priority <= max_priority);
    return (React.createElement(Layout, { heading: max_priority >= max_priority_list_all ? "All Projects" : "Projects" },
        React.createElement(ProjectList, { projects: projects, count: 3 }),
        max_priority < max_priority_list_all ? React.createElement(Link, { className: `${util_styles.block} ${util_styles.link}`, to: `/projects?max_priority=${max_priority_list_all}` }, "Show All") : undefined));
};
export default Projects;
export const query = graphql `
query Projects {
  allMdx(
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
