import React from "react";
import { Link, graphql } from "gatsby";
import Layout from "src/components/layout";
import * as styles from "src/styles/privacy.module.scss";
import * as util_styles from "src/styles/utils.module.scss";
const Privacy = ({ data }) => {
    const email_name = data.site?.siteMetadata?.privacy_email?.name;
    const email_link = data.site?.siteMetadata?.privacy_email?.link;
    return (React.createElement(Layout, { heading: "Privacy Policy" },
        React.createElement("div", { className: `${styles.privacy} ${util_styles.main_block}` },
            React.createElement("p", null, "This privacy policy will explain how I and any necessary third-party services use the personal data collected from you when you use my website."),
            React.createElement("h1", null, "tl;dr"),
            React.createElement("p", null,
                "This website collects your IP address; you should read ",
                React.createElement("a", { href: "https://www.netlify.com/gdpr-ccpa" }, "Netlify's privacy policy"),
                "."),
            React.createElement("h1", null, "What data do I collect?"),
            React.createElement("p", null,
                "I myself don't collect any personal data. Though my hoster ",
                React.createElement("a", { href: "https://www.netlify.com" }, "Netlify"),
                " does keep an access log required to operate this website. This access log includes most notably your IP address and access time stamps, which are stored (by Netlify) for less than 30 days."),
            React.createElement("p", null,
                "Your IP address can be used to determine your rough physical location. If you intend to keep your position secret, you are advised to utilize an anonymizing service such as the ",
                React.createElement("a", { href: "https://www.torproject.org" }, "Tor Network"),
                "."),
            React.createElement("p", null, "Your access time stamp can be used to identify you temporal location. As of today, there is no established method of changing the flow of time."),
            React.createElement("p", null,
                "You should read ",
                React.createElement("a", { href: "https://www.netlify.com/gdpr-ccpa" }, "Netlify's privacy policy"),
                " as their privacy notice applies."),
            React.createElement("h1", null, "Privacy policies of other websites"),
            React.createElement("p", null, "My website contains links to other websites. This privacy policy applies only to my website. So if you click on a link to another website, you should read their privacy policy."),
            React.createElement("h1", null, "Changes to my privacy policy"),
            React.createElement("p", null, "I keep my privacy policy under regular review and place any updates on this web page. This privacy policy was last updated on 2 January 2022."),
            React.createElement("h1", null, "How to contact me"),
            React.createElement("p", null,
                "If you have any questions about my privacy policy, please do not hesitate to ",
                React.createElement(Link, { to: "/about" }, "contact me"),
                "."),
            React.createElement("p", null,
                "Email me at: ",
                React.createElement("a", { href: email_link }, email_name)))));
};
export default Privacy;
export const query = graphql `
query Privacy {
  site {
    siteMetadata {
      privacy_email {
        name
        link
      }
    }
  }
}
`;
