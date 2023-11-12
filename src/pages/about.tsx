import React from "react";
import { Link, graphql, PageProps } from "gatsby";
import Layout from "src/components/layout";
import SEO from "src/components/seo";
import * as styles from "src/styles/about.module.scss";
import * as util_styles from "src/styles/utils.module.scss";
import get_mask from "src/utils/svg_mask";

const About = ({ data }: PageProps<Queries.AboutQuery>) => {
    const email_name = data.site?.siteMetadata?.email?.name as string;
    const email_link = data.site?.siteMetadata?.email?.link as string;

    const github_name = data.site?.siteMetadata?.github?.name as string;
    const github_link = data.site?.siteMetadata?.github?.link as string;

    let width_properties = {
        "--full-width": "100%",
        "--half-width": "100%",
        "--quarter-width": "100%",
    } as React.CSSProperties;
    return (
        <Layout heading="About & Contact">
            <div className={styles.container}>
                <div className={styles.rocket}>
                    <div className={styles.rocket_elements}>
                        <p className={styles.left}>Twenty seconds and counting.</p>
                        <p className={styles.right}>
                            I'm a problem solver.
                            Solving problems because we can is amazing, but what really catches my motivation is a user who's life I can improve.
                        </p>
                        <p className={styles.left}>T minus 15 seconds, guidance is internal.</p>
                        <p className={styles.right}>
                            The bigger the project, the better; even if it doesn't quite suit my taste.
                            I don't mind dedicating all my work to the handle of the door to the cockpit of a spacecraft.
                        </p>
                        <p className={styles.left}>12, 11, 10, 9, ignition sequence start...</p>
                        <p className={styles.right}>
                            When I'm doing my part and others can rely on what I've built, I feel fulfilled.
                            After all I'm using other people's work for my own foundation.
                        </p>
                        <p className={styles.left}>...6, 5, 4, 3...</p>
                        <p className={styles.right}>
                            I like people&mdash;people are great!
                            Whenever possible I work in a team, solving even bigger problems.
                        </p>
                        <p className={styles.left}>...2, 1, zero, all engine running...</p>
                        <p className={styles.right}>
                            When it comes to taste, I prefer the Terminal over a GUI, VIM over huge IDEs, backend over frontend, C++ over Python and Linux over Windows.
                            But those are just that&mdash;tastes.
                            When it's absolutely required to work with Visual Studio Code on a frontend for Windows in HTML, I bite the bullet and do it.
                        </p>
                        <p className={styles.left}>LIFT-OFF! We have a lift-off, 32 minutes past the hour. Lift-off on Apollo 11.</p>
                        <p className={styles.right}>
                            Have a nice day.
                        </p>
                    </div>
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
                </div>
            </div>
        </Layout >
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
