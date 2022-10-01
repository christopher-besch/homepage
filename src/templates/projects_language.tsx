import React from "react";
import { Link, graphql, PageProps } from "gatsby";

import Layout from "src/components/layout";
import ProjectList, { gql_to_project } from "src/components/project_list";
import * as util_styles from "src/styles/utils.module.scss";
import { languages } from "src/utils/languages";
import { max_priority_language_default, max_priority_language_all } from "src/utils/consts";

interface ProjectsLanguageProps extends PageProps<Queries.ProjectsLanguageQuery> {
    // TODO: better type
    pageContext: Record<string, any>;
}
const ProjectsLanguage  = ({ data, pageContext, location }: ProjectsLanguageProps) => {
    const max_priority_raw = new URL(location.href).searchParams.get("max_priority");
    const max_priority = max_priority_raw != null ? parseInt(max_priority_raw) : max_priority_language_default;

    const all_projects = data.allMdx.edges.map(gql_to_project);
    const projects = all_projects.filter(project => project.priority <= max_priority);
    const selected_language_id = pageContext.language;
    const selected_language = languages.get(selected_language_id)!;

    return (
        <Layout heading={`${selected_language.name} Projects`} sub_heading={selected_language_id == "java" ? " You found an easter egg!" : ""} icon={selected_language.icon_mono}>
            <ProjectList projects={projects} count={3} />
            <Link className={`${util_styles.block} ${util_styles.link}`} to="/projects">Other Projects</Link>
            {max_priority < max_priority_language_all ? <Link className={`${util_styles.block} ${util_styles.link}`} to={`/projects/${selected_language.id}?max_priority=${max_priority_language_all}`}>Show All</Link> : undefined}
        </Layout >);
};
export default ProjectsLanguage;

export const query = graphql`
query ProjectsLanguage($language: [String]) {
  allMdx(
    sort: {fields: frontmatter___priority, order: ASC}
    filter: {frontmatter: {type: {eq: "project"}, languages: {in: $language}}}
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
