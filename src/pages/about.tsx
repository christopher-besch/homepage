import React from "react";
import { graphql } from "gatsby";
import Layout from "src/components/layout";
import * as styles from "src/styles/about.module.scss";
import * as util_styles from "src/styles/utils.module.scss";
import { AboutData } from "./__generated__/about-data";
import get_mask from "src/utils/svg_mask";

interface AboutProps {
    data: AboutData;
}
const About: React.FC<AboutProps> = (props) => {
    const discord_name = props.data.site?.siteMetadata?.discord?.name as string;
    const discord_link = props.data.site?.siteMetadata?.discord?.link as string;

    const email_name = props.data.site?.siteMetadata?.email?.name as string;
    const email_link = props.data.site?.siteMetadata?.email?.link as string;

    const github_name = props.data.site?.siteMetadata?.github?.name as string;
    const github_link = props.data.site?.siteMetadata?.github?.link as string;

    const linkedin_name = props.data.site?.siteMetadata?.linkedin?.name as string;
    const linkedin_link = props.data.site?.siteMetadata?.linkedin?.link as string;

    let width_properties = {
        "--full-width": "100%",
        "--half-width": "100%",
        "--quarter-width": "100%",
    } as React.CSSProperties;
    return (
        <Layout heading="About & Contact">
            <div className={styles.container}>
                <div className={styles.left_cont}>
                    <div className={`${util_styles.block} ${styles.about}`}>
                        <p>
                            I'm a problem solver.
                            Solving problems because we can is amazing, but what really catches my motivation is a user who's life I can improve.
                        </p><br />

                        <p>
                            The bigger the project, the better; even if it doesn't quite suit my taste.
                            I don't mind dedicating all my work to the handle of the door to the cockpit of a spacecraft.
                        </p><br />

                        <p>
                            When I'm doing my part and others can rely on what I've built, I feel fulfilled.
                            After all I'm using other people's work for my own foundation.
                        </p><br />

                        <p>
                            I like people&mdash;people are great!
                            Whenever possible I work in a team, solving even bigger problems.
                        </p><br />

                        <p>
                            When it comes to taste, I prefer the Terminal over a GUI, VIM over huge IDEs, backend over frontend, C++ over Python and Linux over Windows.
                            But those are justs that&mdash;tastes.
                            When it's absolutely required to work with Visual Studio Code on a frontend for Windows in HTML, I bite the bullet and do it.
                        </p><br />

                        <p>
                            Have a nice day.
                        </p>
                    </div>
                </div>
                <div className={styles.contacts}>
                    <a href={github_link} target="_blank" className={`${styles.project} ${styles.contact}`} style={width_properties}>
                        <div className={styles.content}>
                            <span className={styles.icon} style={get_mask("/icons/github.svg")}></span>
                            <hr />
                            <h3>{github_name}</h3>
                        </div>
                    </a>
                    <a href={linkedin_link} target="_blank" className={`${styles.project} ${styles.contact}`} style={width_properties}>
                        <div className={styles.content}>
                            <span className={styles.icon} style={get_mask("/icons/linkedin.svg")}></span>
                            <hr />
                            <h3>{linkedin_name}</h3>
                        </div>
                    </a>
                    <a href={discord_link} target="_blank" className={`${styles.project} ${styles.contact}`} style={width_properties}>
                        <div className={styles.content}>
                            <span className={styles.icon} style={get_mask("/icons/discord.svg")}></span>
                            <hr />
                            <h3>{discord_name}</h3>
                        </div>
                    </a>
                    <a href={email_link} target="_blank" className={`${styles.project} ${styles.contact}`} style={width_properties}>
                        <div className={styles.content}>
                            <span className={styles.icon} style={get_mask("/icons/email-svgrepo-com.svg")}></span>
                            <hr />
                            <h3>{email_name}</h3>
                        </div>
                    </a>
                </div>
            </div>
        </Layout>
    );
};
export default About;

export const query = graphql`
query AboutData {
  site {
    siteMetadata {
      linkedin {
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
