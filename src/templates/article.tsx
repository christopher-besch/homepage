import React from "react";
import Layout from "../components/layout";
import * as styles from "../styles/article.module.scss";
import { graphql } from "gatsby";
import { ArticlePage } from "./__generated__/article-page";

interface ProjectProps {
    data: ArticlePage;
}
const Project: React.FC<ProjectProps> = (props) => {
    const html = props.data.markdownRemark?.html as string;
    const title = props.data.markdownRemark?.frontmatter?.title as string;
    const description = props.data.markdownRemark?.frontmatter?.description as string;
    const date = props.data.markdownRemark?.frontmatter?.date as string;
    return (
        <Layout heading={title} sub_heading={description}>
            <div className={styles.article}>
                <p>{date}</p>
                <div dangerouslySetInnerHTML={{ __html: html }} />
            </div>
        </Layout>
    );
}
export default Project;

export const query = graphql`
query ArticlePage($slug: String) {
  markdownRemark(frontmatter: {slug: {eq: $slug}, type: {eq: "article"}}) {
    html
    frontmatter {
      date(formatString: "MMMM YYYY")
      title
      description
    }
  }
}
`;
