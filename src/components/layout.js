import { graphql, Link, useStaticQuery } from "gatsby";
import React from "react";
import { Helmet } from "react-helmet";
import { globalHistory } from "@reach/router";
import Heading from "src/components/heading";
import "src/styles/global.scss";
import * as styles from "src/styles/layout.module.scss";
const Layout = (props) => {
    const data = useStaticQuery(graphql `
query LayoutData {
  site {
    siteMetadata {
      source
      origin
      default_origin
    }
  }
}
    `);
    const source = data.site.siteMetadata.source;
    const title = props.heading ? `${props.heading}—Christopher Besch` : "Christopher Besch—Software Developer";
    const description = props.description;
    const url = globalHistory.location.href;
    const origin = data.site.siteMetadata.origin;
    const deploy_origin = data.site.siteMetadata.default_origin;
    const path = globalHistory.location.pathname;
    // replace origin with default one
    const canonical_url = `${deploy_origin}${path}`;
    const banner = props.banner ? `${origin}${props.banner}` : undefined;
    return (React.createElement("div", null,
        React.createElement(Helmet, { htmlAttributes: { lang: "en" } },
            React.createElement("meta", { charSet: "utf-8" }),
            React.createElement("title", null, title),
            React.createElement("link", { rel: "canonical", href: canonical_url }),
            React.createElement("link", { rel: "shortcut icon", href: "/favicon.png" }),
            React.createElement("meta", { property: "og:url", content: url }),
            React.createElement("meta", { property: "og:title", content: title }),
            description ? React.createElement("meta", { property: "og:description", content: description }) : undefined,
            banner ? React.createElement("meta", { property: "og:image", content: banner }) : undefined,
            React.createElement("meta", { name: "twitter:card", content: banner ? "summary_large_image" : "summary" }),
            React.createElement("meta", { name: "twitter:site", content: "@besch_chris" }),
            React.createElement("meta", { name: "twitter:creator", content: "@besch_chris" }),
            banner ? React.createElement("meta", { property: "twitter:image:src", content: banner }) : undefined,
            React.createElement("meta", { name: "author", content: "Christopher Besch" }),
            React.createElement("meta", { name: "description", content: title }),
            React.createElement("link", { rel: "preload", href: "/fonts/LiberationSans-Regular-webfont.woff", as: "font", type: "font/woff", crossOrigin: "anonymous" }),
            React.createElement("link", { rel: "preload", href: "/fonts/LiberationMono-Regular-webfont.woff", as: "font", type: "font/woff", crossOrigin: "anonymous" })),
        React.createElement("nav", { className: styles.nav },
            React.createElement("div", { className: styles.logo },
                React.createElement("h1", null, "Christopher Besch"),
                React.createElement("h2", null, "Software Developer")),
            React.createElement("div", null,
                React.createElement("input", { type: "checkbox", id: "nav_toggle" }),
                React.createElement("label", { htmlFor: "nav_toggle", className: styles.hamburger }, "\u2630"),
                React.createElement("ul", { className: styles.nav_menu },
                    React.createElement("li", null,
                        React.createElement(Link, { to: "/" }, "Home")),
                    React.createElement("li", null,
                        React.createElement(Link, { to: "/projects" }, "Projects")),
                    React.createElement("li", null,
                        React.createElement(Link, { to: "/articles" }, "Articles")),
                    React.createElement("li", null,
                        React.createElement(Link, { to: "/about" }, "About"))))),
        React.createElement("div", { className: styles.content },
            props.heading ? React.createElement(Heading, { heading: props.heading, icon: props.icon, sub_heading: props.sub_heading }) : undefined,
            props.children),
        React.createElement("footer", { className: styles.footer },
            React.createElement("ul", null,
                React.createElement("li", { className: styles.link },
                    React.createElement(Link, { to: "/about" }, "Contact")),
                React.createElement("li", { className: styles.link },
                    React.createElement("a", { href: source, target: "_blank" }, "Source")),
                React.createElement("li", { className: styles.link },
                    React.createElement(Link, { to: "/privacy" }, "Privacy")),
                React.createElement("li", null,
                    React.createElement("p", null, "\u00A9 2022")),
                React.createElement("li", { className: styles.emoji },
                    React.createElement("p", null, "\uD83D\uDD17"))))));
};
export default Layout;
