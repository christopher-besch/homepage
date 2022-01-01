import { graphql } from "gatsby";
import React from "react";
import Layout from "src/components/layout";

import * as styles from "src/styles/contact.module.scss";
import { ContactData } from "./__generated__/contact-data";
import get_mask from "src/utils/svg_mask";
import * as list_styles from "src/styles/project_list.module.scss";

interface ContactProps {
    data: ContactData;
}
const Contact: React.FC<ContactProps> = (props) => {
    const discord_name = props.data.site?.siteMetadata?.discord?.name as string;
    const discord_link = props.data.site?.siteMetadata?.discord?.link as string;

    const email_name = props.data.site?.siteMetadata?.email?.name as string;
    const email_link = props.data.site?.siteMetadata?.email?.link as string;

    const github_name = props.data.site?.siteMetadata?.github?.name as string;
    const github_link = props.data.site?.siteMetadata?.github?.link as string;

    const linkedin_name = props.data.site?.siteMetadata?.linkedin?.name as string;
    const linkedin_link = props.data.site?.siteMetadata?.linkedin?.link as string;

    let width_properties = {
        "--full-width": "50%",
        "--half-width": "100%",
        "--quarter-width": "100%",
    } as React.CSSProperties;

    return (
        <Layout heading="Contact">

            <div className={list_styles.projects}>
                <div className={styles.contacts}>
                    <a href={github_link} target="_blank" className={`${list_styles.project} ${styles.contact}`} style={width_properties}>
                        <div className={list_styles.content}>
                            <span className={styles.icon} style={get_mask("/icons/github.svg")}></span>
                            <h3>{github_name}</h3>
                            <hr />
                            <div className={styles.text}>
                                <p>
                                    Check out my open source contributions on GitHub.
                                </p>
                            </div>
                        </div>
                    </a>
                    <a href={linkedin_link} target="_blank" className={`${list_styles.project} ${styles.contact}`} style={width_properties}>
                        <div className={list_styles.content}>
                            <span className={styles.icon} style={get_mask("/icons/linkedin.svg")}></span>
                            <h3>{linkedin_name}</h3>
                            <hr />
                            <div className={styles.text}>
                                <p>
                                    I don't have too much on my Linkedin.
                                    But it might still be interesting.
                                </p>
                            </div>
                        </div>
                    </a>
                    <a href={discord_link} target="_blank" className={`${list_styles.project} ${styles.contact}`} style={width_properties}>
                        <div className={list_styles.content}>
                            <span className={styles.icon} style={get_mask("/icons/discord.svg")}></span>
                            <h3>{discord_name}</h3>
                            <hr />
                            <div className={styles.text}>
                                <p>
                                    If you want to chat with me, feel free to message me on Discord.
                                </p>
                            </div>
                        </div>
                    </a>
                    <a href={email_link} target="_blank" className={`${list_styles.project} ${styles.contact}`} style={width_properties}>
                        <div className={list_styles.content}>
                            <span className={styles.icon} style={get_mask("/icons/email-svgrepo-com.svg")}></span>
                            <h3>{email_name}</h3>
                            <hr />
                            <div className={styles.text}>
                                <p>
                                    You should have noticed by now that these descriptions are basically place-holders to make the layout feel less lonely.
                                </p>
                            </div>
                        </div>
                    </a>
                </div>
            </div>
        </Layout>
    );
};
export default Contact;

export const query = graphql`
query ContactData {
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
