import { graphql } from "gatsby";
import React from "react";
import Layout from "../components/layout";
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
            <table>
                <tr>
                    <td>GitHub</td>
                    <td><a href={github_link}>{github_name}</a></td>
                </tr>
                <tr>
                    <td>LinkedIn</td>
                    <td><a href={linkedin_link}>{linkedin_name}</a></td>
                </tr>
                <tr>
                    <td>Email</td>
                    <td><a href={email_link}>{email_name}</a></td>
                </tr>
                <tr>
                    <td>Discord</td>
                    <td><a href={discord_link}>{discord_name}</a></td>
                </tr>
            </table>
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
