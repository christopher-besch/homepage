import React from "react";
import { Link, graphql } from "gatsby";

import Layout from "src/components/layout";
import SEO from "src/components/seo";
import ProjectList, { gql_to_project } from "src/components/project_list";
import * as util_styles from "src/styles/utils.module.scss";
import { max_priority_list_default, max_priority_list_all } from "src/utils/consts";
import { with_location, PropsWithLocation } from "src/utils/with_location";

interface ProjectsProps extends PropsWithLocation {
    data: Queries.ProjectsQuery;
}
const Projects = ({ data, search }: ProjectsProps) => {
    const max_priority = search.max_priority != null ? parseInt(search.max_priority as string) : max_priority_list_default;
    const all_projects = data.allMdx.edges.map(gql_to_project);
    const projects = all_projects.filter(project => project.priority <= max_priority);

    return (
        <Layout heading={max_priority >= max_priority_list_all ? "All Projects" : "Projects"}>
            <ProjectList projects={projects} count={3} />
            {max_priority < max_priority_list_all ? <Link className={`${util_styles.block} ${util_styles.link}`} to={`/projects?max_priority=${max_priority_list_all}`}>Show All</Link> : undefined}
        </Layout >
    );
};
export default with_location(Projects);

export const query = graphql`
query Projects {
  allMdx(
    sort: {frontmatter: {priority: ASC}}
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

export const Head = () => (
    <SEO heading="Projects" />
);
