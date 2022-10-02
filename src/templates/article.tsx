import React from "react";
import Layout from "../components/layout";
import * as styles from "../styles/article.module.scss";
import * as markdown_styles from "../styles/markdown.module.scss";
import { graphql } from "gatsby";
import { MDXProvider } from "@mdx-js/react"

const shortcodes = {
    // TODO: remoe test
    Layout
};

interface ArticleProps {
    data: Queries.ArticleQuery;
    children?: React.ReactNode;
}
const Article = ({ data, children }: ArticleProps) => {
    const version = data.mdx?.frontmatter?.version as string;
    const title = data.mdx?.frontmatter?.title as string;
    const sub_heading = /^0\./.test(version) ? `Draft v${version}` : undefined;

    const description = data.mdx?.frontmatter?.description as string;
    // TODO: combine thumb and banner frontmatter (maybe use regex)
    const banner_raw = data.mdx?.frontmatter?.banner as string | undefined;
    const banner = !banner_raw || banner_raw == "undefined" ? undefined : banner_raw;
    const date = data.mdx?.frontmatter?.date as string;
    return (
        <Layout heading={title} sub_heading={sub_heading} description={description} banner={banner}>
            <div className={styles.metadata}>
                <span className={styles.author}>Written by Christopher Besch, published on </span>{date}
            </div>
            <div className={markdown_styles.markdown_body}>
                <MDXProvider components={shortcodes}>
                    {children}
                </MDXProvider>
            </div>
        </Layout>
    );
}
export default Article;

export const query = graphql`
query Article($id: String!) {
  mdx(id: { eq: $id }) {
    body
    frontmatter {
      date(formatString: "dddd, MMMM D, YYYY")
      title
      description
      banner
      version
    }
  }
}
`;

