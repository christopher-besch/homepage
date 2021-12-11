import { graphql } from "gatsby";
import React from "react";
import Layout from "src/components/layout";

import * as styles from "src/styles/contact.module.scss";
import { ContactData } from "./__generated__/contact-data";
import get_mask from "src/utils/svg_mask";

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

    return (
        <Layout heading="Contact">
            <div className={styles.contacts}>
                <a className={styles.contact} href={github_link}>
                    <div className={styles.content}>
                        <span className={styles.icon} style={get_mask("/icons/github.svg")}></span>
                        <p>{github_name}</p>
                    </div>
                </a>
                <a className={styles.contact} href={linkedin_link}>
                    <div className={styles.content}>
                        <span className={styles.icon} style={get_mask("/icons/linkedin.svg")}></span>
                        <p>{linkedin_name}</p>
                    </div>
                </a>
                <a className={styles.contact} href={discord_link}>
                    <div className={styles.content}>
                        <span className={styles.icon} style={get_mask("/icons/discord.svg")}></span>
                        <p>{discord_name}</p>
                    </div>
                </a>
                <a className={styles.contact} href={email_link}>
                    <div className={styles.content}>
                        <span className={styles.icon} style={get_mask("/icons/email-svgrepo-com.svg")}></span>
                        <p>{email_name}</p>
                    </div>
                </a>
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