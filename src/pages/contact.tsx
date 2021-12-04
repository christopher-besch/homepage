import { graphql } from "gatsby";
import React from "react";
import Layout from "../components/layout";
import Heading from "../components/heading";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub, faLinkedin, faDiscord } from "@fortawesome/free-brands-svg-icons";
import { faAt } from "@fortawesome/free-solid-svg-icons";

import * as styles from "../styles/contact.module.css";
import { ContactData } from "./__generated__/contact-data";

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
        <Layout>
            <Heading>
                <h1>Contact</h1>
                <hr />
            </Heading>
            <div className={styles.contacts}>
                <div className={styles.contact}>
                    <div className={styles.content}>
                        <FontAwesomeIcon icon={faGithub} size={"10x"} />
                        <h3>GitHub</h3>
                        <a href={github_link}>{github_name}</a>
                    </div>
                </div>
                <div className={styles.contact}>
                    <div className={styles.content}>
                        <FontAwesomeIcon icon={faLinkedin} size={"10x"} />
                        <h3>LinkedIn</h3>
                        <a href={linkedin_link}>{linkedin_name}</a>
                    </div>
                </div>
                <div className={styles.contact}>
                    <div className={styles.content}>
                        <FontAwesomeIcon icon={faDiscord} size={"10x"} />
                        <h3>Discord</h3>
                        <a href={discord_link}>{discord_name}</a>
                    </div>
                </div>
                <div className={styles.contact}>
                    <div className={styles.content}>
                        <FontAwesomeIcon icon={faAt} size={"10x"} />
                        <h3>Mail</h3>
                        <a href={email_link}>{email_name}</a>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
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
