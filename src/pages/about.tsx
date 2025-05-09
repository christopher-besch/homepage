import React from "react";
import { graphql, Link, PageProps } from "gatsby";
import Layout from "src/components/layout";
import SEO from "src/components/seo";
import * as styles from "src/styles/about.module.scss";
import get_mask from "src/utils/svg_mask";
import { GatsbyImage, getImage, ImageDataLike } from "gatsby-plugin-image";

const About = ({ data }: PageProps<Queries.AboutQuery>) => {
    const email_name = data.site?.siteMetadata?.email?.name as string;
    const email_link = data.site?.siteMetadata?.email?.link as string;

    const pgp_fingerprint = data.site?.siteMetadata?.pgp?.fingerprint as string;
    const pgp_name = data.site?.siteMetadata?.pgp?.name as string;
    const pgp_link = data.site?.siteMetadata?.pgp?.link as string;

    const github_name = data.site?.siteMetadata?.github?.name as string;
    const github_link = data.site?.siteMetadata?.github?.link as string;

    const codeberg_name = data.site?.siteMetadata?.codeberg?.name as string;
    const codeberg_link = data.site?.siteMetadata?.codeberg?.link as string;

    let width_properties = {
        "--full-width": "100%",
        "--half-width": "100%",
        "--quarter-width": "100%",
    } as React.CSSProperties;
    const banner_image_style = {
        "--banner-image-horizontal-position": "80%",
        "--banner-image-vertical-position": "40%",
    } as React.CSSProperties;
    return (
        <Layout banner_image={data.banner_photo as ImageDataLike} banner_image_style={banner_image_style} heading="About & Contact">
            <div className={styles.container}>
                <div className={styles.rocket}>
                    <div className={styles.rocket_elements}>
                        <GatsbyImage className={`${styles.chris_head}`} image={getImage(data.chris_head as ImageDataLike)!} alt="chris head" />
                        <p className={styles.right}>Twenty seconds and counting.</p>
                        <p className={styles.left}>
                            Hi, welcome to my place on the web!
                            This is where I post random personal projects and crave positive feedback.
                            <br />
                            <i>
                                Do so via <a href={email_link}>mail</a> or with hearts and stars on <a href={github_link} target="_blank">GitHub</a>/<a href={codeberg_link} target="_blank">Codeberg</a>, thank you :)
                            </i>
                            <br />
                            No seriously, do reach out if you have something cool to share or just to say 'hi'!
                        </p>
                        <p className={styles.right}>T minus 15 seconds, guidance is internal.</p>
                        <p className={styles.left}>
                            I like bolting things together until they don't fall apart anymore.
                            Whenever I can, I do so in groups — watching things go kaput is always more fun with company!
                        </p>
                        <p className={styles.right}>12, 11, 10, 9, ignition sequence start...</p>
                        <p className={styles.left}>
                            What are the things I'm interested in?
                            <br />
                            Everything, kinda.
                            Somehow it's very easy for me to find motivation for all sorts of things — just take a look at my <Link to="/projects">projects</Link> and you'll see where that got me.
                            <br />
                            That's fun and all but In the long run I'd like to work on:
                            <ul>
                                <li>autonomous</li>
                                <li>embedded systems</li>
                                <li>with real-time constraints</li>
                                <li>in a high-risk environment.</li>
                            </ul>
                            You get that I like rockets, right?
                        </p>
                        <p className={styles.right}>...6, 5, 4, 3...</p>
                        <p className={styles.left}>
                            What's more, I love working in public.
                            Open-Source is quite amazing — I try publishing as much as possible.
                            I hope you can find some use for it.
                        </p>
                        <p className={styles.right}>...2, 1, zero, all engine running...</p>
                        <p className={styles.left}>
                            Oh and I love the black abyss that is the Linux terminal.
                            Whenever I feel down, things just fell apart or something else, it is always there for me and greets me with it's blinking cursor.
                        </p>
                        <p className={styles.right}>LIFT-OFF! We have a lift-off, 32 minutes past the hour. Lift-off on Apollo 11.</p>
                        <p className={styles.left}>
                            Thank you and have a very safe and productive day.
                            <br />
                            <i>
                                Do you get the <a href="https://combineoverwiki.net/wiki/Black_Mesa_Transit_System/Quotes#Half-Life" target="_blank">quote</a>?
                            </i>
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
                    <a download={pgp_name} href={pgp_link} className={styles.contact} style={width_properties}>
                        <div className={styles.content}>
                            <span className={styles.icon} style={get_mask("/icons/pgp.svg")}></span>
                            <hr />
                            <h3>{pgp_fingerprint}</h3>
                            {/* <h3>PGP Public Key</h3> */}
                        </div>
                    </a>
                    <a href={codeberg_link} target="_blank" className={styles.contact} style={width_properties}>
                        <div className={styles.content}>
                            <span className={styles.icon} style={get_mask("/icons/codeberg.svg")}></span>
                            <hr />
                            <h3>{codeberg_name}</h3>
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
      pgp {
        fingerprint
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
      codeberg {
        name
        link
      }
    }
  }
  chris_head: file(sourceInstanceName: {eq: "photography"}, name: {eq: "chris_head"}) {
    childImageSharp {
      gatsbyImageData(placeholder: BLURRED)
    }
  }
  banner_photo: file(sourceInstanceName: {eq: "photography"}, name: {eq: "alpha_uniform"}) {
    childImageSharp {
      gatsbyImageData(placeholder: BLURRED)
    }
  }
}
`;

export const Head = () => (
    <SEO heading="About & Contact" />
);
