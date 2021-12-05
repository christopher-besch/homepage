import React from "react";
import Layout from "../components/layout";
import { GatsbyImage, getImage, IGatsbyImageData, ImageDataLike } from "gatsby-plugin-image";
import * as styles from "../styles/project.module.scss";
import { graphql } from "gatsby";
import { ProjectPage } from "./__generated__/project-page";

interface ProjectProps {
    data: ProjectPage;
}
const Project: React.FC<ProjectProps> = (props) => {
    const html = props.data.markdownRemark?.html as string;
    const title = props.data.markdownRemark?.frontmatter?.title as string;
    const start_date = props.data.markdownRemark?.frontmatter?.start_date as string;
    const banner = getImage(props.data.markdownRemark?.frontmatter?.banner as ImageDataLike) as IGatsbyImageData;
    return (
        <Layout>
            <div className={styles.project}>
                <GatsbyImage image={banner} alt="project img" />
                <h1>{title}</h1>
                <p>{start_date}</p>
                <div dangerouslySetInnerHTML={{ __html: html }} />
            </div>
        </Layout>
    );
}
export default Project;

export const query = graphql`
query ProjectPage($slug: String) {
  markdownRemark(frontmatter: {slug: {eq: $slug}}) {
    html
    frontmatter {
      start_date(formatString: "MMMM YYYY")
      title
      banner {
        childImageSharp {
          gatsbyImageData(
            placeholder: BLURRED
          )
        }
      }
    }
  }
}
`;
