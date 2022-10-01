import React from "react";
import { Link } from "gatsby";
import { getImage, GatsbyImage } from "gatsby-plugin-image";
import * as styles from "src/styles/article_list.module.scss";
export function gql_to_article(article) {
    return {
        id: article.node.id,
        date: article.node.frontmatter?.date,
        description: article.node.frontmatter?.description,
        slug: article.node.frontmatter?.slug,
        title: article.node.frontmatter?.title,
        thumb: getImage(article.node.frontmatter?.thumb),
    };
}
const ArticleList = (props) => {
    return (React.createElement("div", { className: props.className }, props.articles.map(article => React.createElement(Link, { to: `/articles/${article.slug}`, key: article.id, className: styles.article },
        React.createElement("div", { className: styles.image },
            React.createElement(GatsbyImage, { image: article.thumb, alt: "thumbnail" })),
        React.createElement("div", { className: styles.body },
            React.createElement("div", null,
                React.createElement("h2", { className: styles.heading }, article.title),
                React.createElement("hr", null),
                React.createElement("div", null, article.description.split("\n").map((paragraph, idx) => React.createElement("p", { key: idx }, paragraph)))),
            React.createElement("p", { className: styles.date }, article.date))))));
};
export default ArticleList;
