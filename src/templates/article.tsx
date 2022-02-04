import React from "react";
import Layout from "../components/layout";
import * as styles from "../styles/article.module.scss";
import * as markdown_styles from "../styles/markdown.module.scss";
import { graphql } from "gatsby";
import { MDXRenderer } from "gatsby-plugin-mdx";
import { ArticlePage } from "./__generated__/article-page";

interface ProjectProps {
    data: ArticlePage;
}
const Project: React.FC<ProjectProps> = (props) => {
    const version = props.data.mdx?.frontmatter?.version as string;
    const body = props.data.mdx?.body as string;
    const title = props.data.mdx?.frontmatter?.title as string;
    const sub_heading = /^0\./.test(version) ? `Draft v${version}` : undefined;

    const description = props.data.mdx?.frontmatter?.description as string;
    // TODO: combine thumb and banner frontmatter (maybe use regex)
    const banner_raw = props.data.mdx?.frontmatter?.banner as string | undefined;
    const banner = !banner_raw || banner_raw == "undefined" ? undefined : banner_raw;
    const date = props.data.mdx?.frontmatter?.date as string;
    return (
        <Layout heading={title} sub_heading={sub_heading} description={description} banner={banner}>
            <div className={markdown_styles.markdown_body}>
                <div className={styles.heading}>
                    <div className={styles.metadata}>
                        <span className={styles.author}>Christopher Besch,</span> {date}
                    </div>
                </div>
                <MDXRenderer>{body}</MDXRenderer>
            </div>
        </Layout>
    );
}
export default Project;

export const query = graphql`
query ArticlePage($slug: String) {
  mdx(frontmatter: {slug: {eq: $slug}, type: {eq: "article"}}) {
    body
    frontmatter {
      date(formatString: "MMMM YYYY")
      title
      description
      banner
      version
    }
  }
}
`;
