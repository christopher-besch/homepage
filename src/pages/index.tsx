import React from "react";
import Layout from "../components/layout";
import * as styles from "../styles/home.module.scss";
import { graphql } from "gatsby";
import { HomePage } from "./__generated__/home-page";
import { GatsbyImage, getImage, ImageDataLike } from "gatsby-plugin-image";
import { Link } from "@reach/router";

interface HomeProps {
    data: HomePage
}
const Home: React.FC<HomeProps> = (props) => {
    const projects = props.data.allMarkdownRemark.edges;

    return (
        <Layout heading="Flagship Projects">
            <div className={styles.projects}>
                {projects.map(project =>
                    <Link to={`/project/${project.node.frontmatter?.slug}`} key={project.node.id} className={styles.project}>
                        <div className={styles.content}>
                            <GatsbyImage image={getImage(project.node.frontmatter?.thumb as ImageDataLike)!} alt="thumbnail" />
                            <h3>{project.node.frontmatter?.title}</h3>
                            <p>{project.node.frontmatter?.description}</p>
                        </div>
                    </Link>
                )}
            </div>
        </Layout >
    )
};
export default Home;

export const query = graphql`
query HomePage {
  allMarkdownRemark(
    filter: {frontmatter: {priority: {gte: 0, lte: 1}}}
    sort: {fields: frontmatter___priority, order: ASC}
  ) {
    edges {
      node {
        id
        frontmatter {
          language
          dependencies
          slug
          description
          title
          thumb {
            childImageSharp {
              gatsbyImageData(
                placeholder: BLURRED
              )
            }
          }
        }
      }
    }
  }
}
`;
