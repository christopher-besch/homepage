import React from "react";
import Layout from "../components/layout";
import * as styles from "../styles/article.module.scss";
import * as markdown_styles from "../styles/markdown.module.scss";
import * as util_styles from "src/styles/utils.module.scss";
import { graphql, Link } from "gatsby";
import { MDXProvider } from "@mdx-js/react"
import { MDXComponents } from "mdx/types.js";
import CompareView from "compare_view";

import AutoPlayVideo from "src/components/autoplay_video";
import HalfImage from "src/components/half_image";
import Spacer from "src/components/spacer";
import Quote from "src/components/quote";
import Iframe from "src/components/iframe";
import SEO from "src/components/seo";
import PrismSyntaxHighlight from "src/components/code";

const shortcodes: MDXComponents = {
    AutoPlayVideo,
    HalfImage,
    Spacer,
    Quote,
    Iframe,
    Link,
    CompareView,
    pre: ({ children, className }) => { return (<div className="code-container" > <pre>{children}</pre></div>) },
    code: ({ children, className }) => {
        return className ? (
            <PrismSyntaxHighlight className={className}>{children}</PrismSyntaxHighlight>
        ) : <code className="language-text">{children}</code>
    }
};

interface ArticleProps {
    data: Queries.ArticleQuery;
    children?: React.ReactNode;
}
const Article = ({ data, children }: ArticleProps) => {
    const version = data.mdx?.frontmatter?.version as string;
    const title = data.mdx?.frontmatter?.title as string;
    const sub_heading = /^0\./.test(version) ? `Draft v${version}` : undefined;

    const date = data.mdx?.frontmatter?.date as string;
    return (
        <Layout heading={title} sub_heading={sub_heading}>
            <div className={styles.metadata}>
                <span className={styles.author}>Written by Christopher Besch, published on </span>{date}
            </div>
            <div className={markdown_styles.markdown_body}>
                <MDXProvider components={shortcodes}>
                    {children}
                </MDXProvider>
            </div>
            <Link className={`${util_styles.block} ${util_styles.link}`} to="/articles">More Articles</Link>
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

export const Head = ({ data }: { data: Queries.ArticleQuery }) => {
    const title = data.mdx?.frontmatter?.title as string;
    const description = data.mdx?.frontmatter?.description as string;
    // TODO: combine thumb and banner frontmatter (maybe use regex)
    const banner_raw = data.mdx?.frontmatter?.banner as string | undefined;
    const banner = !banner_raw || banner_raw == "undefined" ? undefined : banner_raw;

    return (
        <SEO heading={title} description={description} banner={banner} />
    );
};

