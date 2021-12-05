import React from "react";
import Layout from "../components/layout";
import * as styles from "../styles/home.module.scss";
import { graphql } from "gatsby";
import { HomePage } from "./__generated__/home-page";

interface HomeProps {
    data: HomePage
}
const Home: React.FC<HomeProps> = (props) => {
    const projects = props.data.allMarkdownRemark.edges.map(project => project.node.frontmatter!);
    return (
        <Layout heading="Flagship Projects">
            <div className={styles.projects}>
                {projects.map(project =>
                    <div className={styles.project}>
                        <div className={styles.content}>
                            <img src="https://www.w3schools.com/w3images/lights.jpg" alt="broken image" />
                            <h3>{project.title}</h3>
                            <p>{project.description}</p>
                        </div>
                    </div>
                )}
            </div>
        </Layout >
    )
};
export default Home;

export const query = graphql`
query HomePage {
  allMarkdownRemark(
    # filter: {frontmatter: {priority: {gte: 0, lte: 1}}}
    sort: {fields: frontmatter___priority, order: ASC}
  ) {
    edges {
      node {
        frontmatter {
          language
          dependencies
          slug
          description
          title
          thumb {
            childImageSharp {
              gatsbyImageData
            }
          }
        }
      }
    }
  }
}
`;
