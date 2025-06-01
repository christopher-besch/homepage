import React from "react";
import Layout from "../components/layout";
import "katex/dist/katex.min.css";
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
import { ImageDataLike } from "gatsby-plugin-image";
import MDXLink from "src/components/mdx_link";

const shortcodes: MDXComponents = {
    AutoPlayVideo,
    HalfImage,
    Spacer,
    Quote,
    Iframe,
    // @ts-ignore
    CompareView,
    pre: ({ children }) => { return (<div className="code-container" > <pre>{children}</pre></div>) },
    code: ({ children, className }) => {
        return className ? (
            <PrismSyntaxHighlight className={className}>{children}</PrismSyntaxHighlight>
        ) : <code className="language-text">{children}</code>
    },
    a: MDXLink,
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
    const use_banner_image = data.mdx?.frontmatter?.title_banner != undefined;

    const banner_image_style = {
        "--banner-image-horizontal-position": data.mdx?.frontmatter?.title_banner_horizontal_position,
        "--banner-image-vertical-position": data.mdx?.frontmatter?.title_banner_vertical_position,
    } as React.CSSProperties;
    return (
        <Layout heading={title} sub_heading={sub_heading} banner_image={use_banner_image ? data.mdx?.frontmatter?.title_banner as ImageDataLike : undefined} banner_image_style={banner_image_style} small_banner={true} banner_content={
            <div className={`${styles.metadata} ${use_banner_image ? styles.banner_metadata : undefined}`}>
                <span className={styles.author}>Written by Christopher Besch, published on </span>{date}
            </div>
        }>
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
      date(formatString: "dddd, Do MMMM, YYYY")
      title
      description
      banner
      title_banner {
        childImageSharp {
          gatsbyImageData(placeholder: BLURRED)
        }
      }
      title_banner_horizontal_position
      title_banner_vertical_position
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

