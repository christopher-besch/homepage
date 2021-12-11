import React from "react";
import { Link, graphql } from "gatsby";
import { ProjectsLanguagePage } from "./__generated__/projects-language-page";

import Layout from "src/components/layout";
import ProjectList, { gql_to_project } from "src/components/project_list";
import * as styles from "src/styles/projects.module.scss";
import { languages } from "src/utils/languages";

interface ProjectsLanguageProps {
    data: ProjectsLanguagePage;
    // TODO: better type
    pageContext: Record<string, any>;
}
const ProjectsLanguage: React.FC<ProjectsLanguageProps> = (props) => {
    const projects = props.data.allMarkdownRemark.edges.map(gql_to_project);
    const selected_language_id = props.pageContext.language;
    const selected_language = languages.get(selected_language_id)!;

    return (
        <Layout heading={`${selected_language.name} Projects`} sub_heading={selected_language_id == "java" ? " You found an easter egg!" : ""} icon={selected_language.icon_mono}>
            <ProjectList projects={projects} />
            <Link className={styles.link} to="/projects">Other Projects</Link>
        </Layout >);
};
export default ProjectsLanguage;

export const query = graphql`
query ProjectsLanguagePage($language: [String]) {
  allMarkdownRemark(
    sort: {fields: frontmatter___priority, order: ASC}
    filter: {frontmatter: {languages: {in: $language}}}
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
