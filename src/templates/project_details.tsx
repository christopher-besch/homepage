import React from "react";
import Layout from "../components/layout";
import { GatsbyImage, getImage, IGatsbyImageData, ImageDataLike } from "gatsby-plugin-image";
import * as styles from "../styles/project_details.module.css";
import { graphql } from "gatsby";
import { ProjectsDetailsPage } from "./__generated__/projects-details-page";

interface ProjectDetailsProps {
    data: ProjectsDetailsPage;
}
const ProjectDetails: React.FC<ProjectDetailsProps> = (props) => {
    const html = props.data.markdownRemark?.html as string;
    const title = props.data.markdownRemark?.frontmatter?.title as string;
    const stack = props.data.markdownRemark?.frontmatter?.stack as string;
    const featuredImg = getImage(props.data.markdownRemark?.frontmatter?.featuredImg as ImageDataLike) as IGatsbyImageData;
    return (
        <Layout>
            <div className={styles.details}>
                <h2>{title}</h2>
                <h3>{stack}</h3>
                <div className={styles.featured}>
                    <GatsbyImage image={featuredImg} alt="project img" />
                </div>
                <div className={styles.html} dangerouslySetInnerHTML={{ __html: html }} />
            </div>
        </Layout>
    );
}
export default ProjectDetails;

// slug passed in from gatsby-node.js
export const query = graphql`
    query ProjectsDetailsPage($slug: String) {
      markdownRemark(frontmatter: {slug: {eq: $slug}}) {
        html
        frontmatter {
          stack
          title
          featuredImg {
            childImageSharp {
              gatsbyImageData
            }
          }
        }
      }
    }
`;
