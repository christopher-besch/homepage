import React from "react";
import Layout from "../components/layout";
import * as styles from "../styles/article.module.scss";
import * as markdown_styles from "../styles/markdown.module.scss";
import { graphql } from "gatsby";
const Project = ({ data, children }) => {
    const version = data.mdx?.frontmatter?.version;
    const title = data.mdx?.frontmatter?.title;
    const sub_heading = /^0\./.test(version) ? `Draft v${version}` : undefined;
    const description = data.mdx?.frontmatter?.description;
    // TODO: combine thumb and banner frontmatter (maybe use regex)
    const banner_raw = data.mdx?.frontmatter?.banner;
    const banner = !banner_raw || banner_raw == "undefined" ? undefined : banner_raw;
    const date = data.mdx?.frontmatter?.date;
    return (React.createElement(Layout, { heading: title, sub_heading: sub_heading, description: description, banner: banner },
        React.createElement("div", { className: styles.metadata },
            React.createElement("span", { className: styles.author }, "Written by Christopher Besch, published on "),
            date),
        React.createElement("div", { className: markdown_styles.markdown_body }, children)));
};
export default Project;
export const query = graphql `
query ArticlePage($slug: String) {
  mdx(frontmatter: {slug: {eq: $slug}, type: {eq: "article"}}) {
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
