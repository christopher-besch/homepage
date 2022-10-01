import React from "react";
import { graphql, Link, PageProps } from "gatsby";

import Layout from "src/components/layout";
import ProjectList, { gql_to_project } from "src/components/project_list";
import ArticleList, { gql_to_article } from "src/components/article_list";
import * as styles from "src/styles/home.module.scss";
import * as util_styles from "src/styles/utils.module.scss";
import Heading from "src/components/heading";
import SubHeading from "src/components/sub_heading";
import HoverIcon from "src/components/hover_icon";
import { max_priority_highlight } from "src/utils/consts";

const Home = ({ data }: PageProps<Queries.HomeQuery>) => {
    const all_projects = data.allMdx.edges.filter(element => element.node.frontmatter?.type == "project").map(gql_to_project);
    const projects = all_projects.filter(project => project.priority <= max_priority_highlight);

    const all_articles = data.allMdx.edges.filter(element => element.node.frontmatter?.type == "article").map(gql_to_article);
    const articles = all_articles.slice(0, 2);

    return (
        <Layout>
            <Heading heading="Hello Smart People!" sub_heading="I'm Chris." />
            <div className={styles.container}>
                <div className={styles.first_con}>
                    <ProjectList className={styles.projects} projects={projects} count={2} />
                    <Link className={`${util_styles.block} ${util_styles.link}`} to="/projects">More Projects</Link>

                    <SubHeading heading="Recent Articles" />
                    <ArticleList className={styles.articles} articles={articles} />
                    <Link className={`${util_styles.block} ${util_styles.link}`} to="/articles">More Articles</Link>
                </div>
                <div className={styles.second_con}>
                    <div className={styles.languages}>
                        <div className={styles.language}><h2>Main Languages</h2></div>
                        <Link to="/projects/cpp" className={styles.language}>
                            <HoverIcon className={styles.icon} icon="/icons/c-plusplus.svg" icon_mono="/icons/c-plusplus_mono.svg" alt="C++" />
                        </Link>
                        <Link to="/projects/typescript" className={styles.language}>
                            <HoverIcon className={styles.icon} icon="/icons/typescript-icon.svg" icon_mono="/icons/typescript-icon_mono.svg" alt="TypeScript" />
                        </Link>
                        <Link to="/projects/python" className={styles.language}>
                            <HoverIcon className={styles.icon} icon="/icons/python.svg" alt="Python" />
                        </Link>
                    </div>
                </div>
            </div>
        </Layout>
    );
};
export default Home;

export const query = graphql`
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
