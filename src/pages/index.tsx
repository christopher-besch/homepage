import React from "react";
import { graphql, Link, PageProps } from "gatsby";
import { getImage, GatsbyImage, IGatsbyImageData, ImageDataLike } from "gatsby-plugin-image";

import Layout from "src/components/layout";
import SEO from "src/components/seo";
import ProjectList, { gql_to_project } from "src/components/project_list";
import ArticleList, { gql_to_article } from "src/components/article_list";
import * as styles from "src/styles/home.module.scss";
import * as util_styles from "src/styles/utils.module.scss";
import * as photography_styles from "src/styles/photography.module.scss";
import Heading from "src/components/heading";
import SubHeading from "src/components/sub_heading";
import HoverIcon from "src/components/hover_icon";
import { max_priority_highlight } from "src/utils/consts";

const Home = ({ data }: PageProps<Queries.HomeQuery>) => {
    const all_projects = data.projects.edges.map(gql_to_project);
    const projects = all_projects.filter(project => project.priority <= max_priority_highlight);

    const all_articles = data.articles.edges.map(gql_to_article);
    const articles = all_articles.slice(0, 4);

    const mono_text = `
I like Heavy Compute.
       Heavy Compute.
`;

    return (
        <Layout banner_image={data.photo as ImageDataLike} banner_image_style={styles.banner_image} banner_content={
            <div className={styles.banner_content}>
                <h1>Welcome to Chris'&nbsp;Place!</h1>
                <p>What are you here for?</p>

                <div className={styles.languages}>
                    <Link to="/projects/cpp" className={styles.language}>
                        <HoverIcon className={styles.icon} icon="/icons/c-plusplus.svg" icon_mono="/icons/c-plusplus_mono.svg" alt="C++" />
                    </Link>
                    <Link to="/projects/rust" className={styles.language}>
                        <HoverIcon className={styles.icon} icon="/icons/rust.svg" alt="Rust" />
                    </Link>
                    <Link to="/projects/typescript" className={styles.language}>
                        <HoverIcon className={styles.icon} icon="/icons/typescript-icon.svg" icon_mono="/icons/typescript-icon_mono.svg" alt="TypeScript" />
                    </Link>
                    <Link to="/projects/python" className={styles.language}>
                        <HoverIcon className={styles.icon} icon="/icons/python.svg" alt="Python" />
                    </Link>
                </div>
            </div>
        }>
            hi
        </Layout>
    );
};
export default Home;

export const query = graphql`
query Home {
  articles: allMdx(
    sort: {frontmatter: {date: DESC}}
    filter: {frontmatter: {type: {eq: "article"}, listed: {eq: true}}}
  ) {
    edges {
      node {
        id
        frontmatter {
          slug
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
  projects: allMdx(
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
  photo: file(sourceInstanceName: {eq: "photography"}, name: {eq: "alpha_quebec"}) {
    childImageSharp {
      gatsbyImageData(placeholder: BLURRED)
    }
  }
}
`;

export const Head = () => (
    <SEO />
);
