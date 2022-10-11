import React from "react";
import { Link, graphql, PageProps } from "gatsby";
import Layout from "src/components/layout";
import SEO from "src/components/seo";
import * as styles from "src/styles/about.module.scss";
import * as util_styles from "src/styles/utils.module.scss";
import get_mask from "src/utils/svg_mask";

const About = ({ data }: PageProps<Queries.AboutQuery>) => {
    const discord_name = data.site?.siteMetadata?.discord?.name as string;
    const discord_link = data.site?.siteMetadata?.discord?.link as string;

    const email_name = data.site?.siteMetadata?.email?.name as string;
    const email_link = data.site?.siteMetadata?.email?.link as string;

    const github_name = data.site?.siteMetadata?.github?.name as string;
    const github_link = data.site?.siteMetadata?.github?.link as string;

    const linkedin_name = data.site?.siteMetadata?.linkedin?.name as string;
    const linkedin_link = data.site?.siteMetadata?.linkedin?.link as string;

    const twitter_name = data.site?.siteMetadata?.twitter?.name as string;
    const twitter_link = data.site?.siteMetadata?.twitter?.link as string;

    let width_properties = {
        "--full-width": "100%",
        "--half-width": "100%",
        "--quarter-width": "100%",
    } as React.CSSProperties;
    return (
        <Layout heading="About & Contact">
            <div className={styles.container}>
                <div className={`${util_styles.block} ${styles.about}`}>
                    <h2>
                        Hello smart people!
                        I'm Chris.
                    </h2>

                    <p>
                        My primary interests lay in tinkering with
                    </p>
                    <ul>
                        <li><a href="https://github.com/christopher-besch/maki">renderers</a>,</li>
                        <li><a href="https://github.com/christopher-besch/time_table_planner">data analysis</a>,</li>
                        <li><a href="https://github.com/christopher-besch/neural_network">neural networks</a> and</li>
                        <li><a href="https://github.com/ToddLinux/ToddLinux">Linux</a>.</li>
                    </ul>
                    <p>
                        But I also work on the occasional <a href="https://addons.mozilla.org/en-US/firefox/addon/bbb-autostatus">WebDev project</a>.
                    </p>

                    <p>
                        I generally like to solve problems, some with more some with less passion.
                        From time to time I also try my hand at writing <Link to="/articles">articles</Link> about some of my work.
                    </p>

                    <p>
                        When it comes to taste, I prefer
                    </p>
                    <ul>
                        <li><a href="https://github.com/christopher-besch/miscellaneous_configs">the terminal</a> over a GUI,</li>
                        <li><a href="https://github.com/christopher-besch/nvim_like_me">VIM</a> over huge IDEs,</li>
                        <li>backends over frontends, I'm not a good designer by any stretch of the imagination :&gt;,</li>
                        <li><Link to="/projects/cpp">C++</Link> over <Link to="/projects/python">Python</Link> or <Link to="/projects/typescript">TypeScript</Link> and</li>
                        <li>Linux over Windows.</li>
                    </ul>
                    <p>
                        Have a nice day.
                    </p>
                </div>
                <div className={styles.contacts}>
                    <a href={email_link} target="_blank" className={styles.contact} style={width_properties}>
                        <div className={styles.content}>
                            <span className={styles.icon} style={get_mask("/icons/email-svgrepo-com.svg")}></span>
                            <hr />
                            <h3>{email_name}</h3>
                        </div>
                    </a>
                    <a href={github_link} target="_blank" className={styles.contact} style={width_properties}>
                        <div className={styles.content}>
                            <span className={styles.icon} style={get_mask("/icons/github.svg")}></span>
                            <hr />
                            <h3>{github_name}</h3>
                        </div>
                    </a>
                    <a href={linkedin_link} target="_blank" className={styles.contact} style={width_properties}>
                        <div className={styles.content}>
                            <span className={styles.icon} style={get_mask("/icons/linkedin.svg")}></span>
                            <hr />
                            <h3>{linkedin_name}</h3>
                        </div>
                    </a>
                    <a href={twitter_link} target="_blank" className={styles.contact} style={width_properties}>
                        <div className={styles.content}>
                            <span className={styles.icon} style={get_mask("/icons/twitter.svg")}></span>
                            <hr />
                            <h3>{twitter_name}</h3>
                        </div>
                    </a>
                    <a href={discord_link} target="_blank" className={styles.contact} style={width_properties}>
                        <div className={styles.content}>
                            <span className={styles.icon} style={get_mask("/icons/discord.svg")}></span>
                            <hr />
                            <h3>{discord_name}</h3>
                        </div>
                    </a>
                </div>
            </div>
        </Layout>
    );
};
export default About;

export const query = graphql`
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

export const Head = () => (
    <SEO heading="About & Contact" />
);
