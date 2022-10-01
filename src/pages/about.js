import React from "react";
import { Link, graphql } from "gatsby";
import Layout from "src/components/layout";
import * as styles from "src/styles/about.module.scss";
import * as util_styles from "src/styles/utils.module.scss";
import get_mask from "src/utils/svg_mask";
const About = ({ data }) => {
    const discord_name = data.site?.siteMetadata?.discord?.name;
    const discord_link = data.site?.siteMetadata?.discord?.link;
    const email_name = data.site?.siteMetadata?.email?.name;
    const email_link = data.site?.siteMetadata?.email?.link;
    const github_name = data.site?.siteMetadata?.github?.name;
    const github_link = data.site?.siteMetadata?.github?.link;
    const linkedin_name = data.site?.siteMetadata?.linkedin?.name;
    const linkedin_link = data.site?.siteMetadata?.linkedin?.link;
    const twitter_name = data.site?.siteMetadata?.twitter?.name;
    const twitter_link = data.site?.siteMetadata?.twitter?.link;
    let width_properties = {
        "--full-width": "100%",
        "--half-width": "100%",
        "--quarter-width": "100%",
    };
    return (React.createElement(Layout, { heading: "About & Contact" },
        React.createElement("div", { className: styles.container },
            React.createElement("div", { className: `${util_styles.block} ${styles.about}` },
                React.createElement("h2", null, "Hello smart people! I'm Chris."),
                React.createElement("p", null,
                    "I'm currently one of ",
                    React.createElement("a", { href: "https://www.manim.community" }, "Manim's"),
                    " Core Developers where I'm project lead of ",
                    React.createElement("a", { href: "https://github.com/ManimCommunity/manim_editor" }, "the Manim Editor"),
                    ". I really enjoy working in such a diverse community of computer scientists, mathematicians, physicists, etc.",
                    React.createElement("br", null),
                    "The different perspectives those people have never cease to delight me."),
                React.createElement("p", null, "My primary interests lay in tinkering with"),
                React.createElement("ul", null,
                    React.createElement("li", null,
                        React.createElement("a", { href: "https://github.com/christopher-besch/maki" }, "renderers"),
                        ","),
                    React.createElement("li", null,
                        React.createElement("a", { href: "https://github.com/christopher-besch/time_table_planner" }, "data analysis"),
                        ","),
                    React.createElement("li", null,
                        React.createElement("a", { href: "https://github.com/christopher-besch/neural_network" }, "neural networks"),
                        " and"),
                    React.createElement("li", null,
                        React.createElement("a", { href: "https://github.com/ToddLinux/ToddLinux" }, "Linux"),
                        ".")),
                React.createElement("p", null,
                    "But I also work on the occasional ",
                    React.createElement("a", { href: "https://addons.mozilla.org/en-US/firefox/addon/bbb-autostatus" }, "WebDev project"),
                    "."),
                React.createElement("p", null,
                    "I generally like to solve problems, some with more some with less passion. From time to time I also try my hand at writing ",
                    React.createElement(Link, { to: "/articles" }, "articles"),
                    " about some of my work."),
                React.createElement("p", null, "When it comes to taste, I prefer"),
                React.createElement("ul", null,
                    React.createElement("li", null,
                        React.createElement("a", { href: "https://github.com/christopher-besch/miscellaneous_configs" }, "the terminal"),
                        " over a GUI,"),
                    React.createElement("li", null,
                        React.createElement("a", { href: "https://github.com/christopher-besch/nvim_like_me" }, "VIM"),
                        " over huge IDEs,"),
                    React.createElement("li", null, "backends over frontends, I'm not a good designer by any stretch of the imagination :>,"),
                    React.createElement("li", null,
                        React.createElement(Link, { to: "/projects/cpp" }, "C++"),
                        " over ",
                        React.createElement(Link, { to: "/projects/python" }, "Python"),
                        " or ",
                        React.createElement(Link, { to: "/projects/typescript" }, "TypeScript"),
                        " and"),
                    React.createElement("li", null, "Linux over Windows.")),
                React.createElement("p", null, "Have a nice day.")),
            React.createElement("div", { className: styles.contacts },
                React.createElement("a", { href: email_link, target: "_blank", className: styles.contact, style: width_properties },
                    React.createElement("div", { className: styles.content },
                        React.createElement("span", { className: styles.icon, style: get_mask("/icons/email-svgrepo-com.svg") }),
                        React.createElement("hr", null),
                        React.createElement("h3", null, email_name))),
                React.createElement("a", { href: github_link, target: "_blank", className: styles.contact, style: width_properties },
                    React.createElement("div", { className: styles.content },
                        React.createElement("span", { className: styles.icon, style: get_mask("/icons/github.svg") }),
                        React.createElement("hr", null),
                        React.createElement("h3", null, github_name))),
                React.createElement("a", { href: linkedin_link, target: "_blank", className: styles.contact, style: width_properties },
                    React.createElement("div", { className: styles.content },
                        React.createElement("span", { className: styles.icon, style: get_mask("/icons/linkedin.svg") }),
                        React.createElement("hr", null),
                        React.createElement("h3", null, linkedin_name))),
                React.createElement("a", { href: twitter_link, target: "_blank", className: styles.contact, style: width_properties },
                    React.createElement("div", { className: styles.content },
                        React.createElement("span", { className: styles.icon, style: get_mask("/icons/twitter.svg") }),
                        React.createElement("hr", null),
                        React.createElement("h3", null, twitter_name))),
                React.createElement("a", { href: discord_link, target: "_blank", className: styles.contact, style: width_properties },
                    React.createElement("div", { className: styles.content },
                        React.createElement("span", { className: styles.icon, style: get_mask("/icons/discord.svg") }),
                        React.createElement("hr", null),
                        React.createElement("h3", null, discord_name)))))));
};
export default About;
export const query = graphql `
query About {
  site {
    siteMetadata {
      linkedin {
        name
        link
      }
      twitter {
        name
        link
      }
      email {
        name
        link
      }
      discord {
        name
        link
      }
      github {
        name
        link
      }
    }
  }
}
`;
