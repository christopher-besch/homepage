import React from "react";
import { graphql, Link } from "gatsby";
import Layout from "src/components/layout";
import ProjectList, { gql_to_project } from "src/components/project_list";
import ArticleList, { gql_to_article } from "src/components/article_list";
import * as styles from "src/styles/home.module.scss";
import * as util_styles from "src/styles/utils.module.scss";
import Heading from "src/components/heading";
import SubHeading from "src/components/sub_heading";
import HoverIcon from "src/components/hover_icon";
import { max_priority_highlight } from "src/utils/consts";
const Home = ({ data }) => {
    const all_projects = data.allMdx.edges.filter(element => element.node.frontmatter?.type == "project").map(gql_to_project);
    const projects = all_projects.filter(project => project.priority <= max_priority_highlight);
    const all_articles = data.allMdx.edges.filter(element => element.node.frontmatter?.type == "article").map(gql_to_article);
    const articles = all_articles.slice(0, 2);
    return (React.createElement(Layout, null,
        React.createElement(Heading, { heading: "Hello Smart People!", sub_heading: "I'm Chris." }),
        React.createElement("div", { className: styles.container },
            React.createElement("div", { className: styles.first_con },
                React.createElement(ProjectList, { className: styles.projects, projects: projects, count: 2 }),
                React.createElement(Link, { className: `${util_styles.block} ${util_styles.link}`, to: "/projects" }, "More Projects"),
                React.createElement(SubHeading, { heading: "Recent Articles" }),
                React.createElement(ArticleList, { className: styles.articles, articles: articles }),
                React.createElement(Link, { className: `${util_styles.block} ${util_styles.link}`, to: "/articles" }, "More Articles")),
            React.createElement("div", { className: styles.second_con },
                React.createElement("div", { className: styles.languages },
                    React.createElement("div", { className: styles.language },
                        React.createElement("h2", null, "Main Languages")),
                    React.createElement(Link, { to: "/projects/cpp", className: styles.language },
                        React.createElement(HoverIcon, { className: styles.icon, icon: "/icons/c-plusplus.svg", icon_mono: "/icons/c-plusplus_mono.svg", alt: "C++" })),
                    React.createElement(Link, { to: "/projects/typescript", className: styles.language },
                        React.createElement(HoverIcon, { className: styles.icon, icon: "/icons/typescript-icon.svg", icon_mono: "/icons/typescript-icon_mono.svg", alt: "TypeScript" })),
                    React.createElement(Link, { to: "/projects/python", className: styles.language },
                        React.createElement(HoverIcon, { className: styles.icon, icon: "/icons/python.svg", alt: "Python" })))))));
};
export default Home;
export const query = graphql `
query Home {
  allMdx(
    sort: {fields: [frontmatter___priority,frontmatter___date], order: [ASC, DESC]},
    filter: {frontmatter: {listed: {eq: true}}}
  ) {
    edges {
      node {
        id
        frontmatter {
          type
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
