import React from "react";
import { Link, graphql } from "gatsby";

import Layout from "src/components/layout";
import * as styles from "src/styles/privacy.module.scss";
import * as util_styles from "src/styles/utils.module.scss";
import { PrivacyData } from "./__generated__/privacy-data";

interface PrivacyProps {
    data: PrivacyData;
}
const Privacy: React.FC<PrivacyProps> = (props) => {
    const email_name = props.data.site?.siteMetadata?.email?.name as string;
    const email_link = props.data.site?.siteMetadata?.email?.link as string;

    return (
        <Layout heading="Privacy Policy">
            <div className={`${styles.privacy} ${util_styles.main_block}`}>
                <p>
                    This privacy policy will explain how I and any necessary third-party services use the personal data collected from you when you use my website.
                </p>

                <h1>tl;dr</h1>
                <p>
                    This website collects your IP address; you should read <a href="https://www.netlify.com/gdpr-ccpa">Netlify's privacy policy</a>.
                </p>

                <h1>What data do I collect?</h1>
                <p>
                    I myself don't collect any personal data.
                    Though my hoster <a href="https://www.netlify.com">Netlify</a> does keep an access log required to operate this website.
                    This access log includes most notably your IP address and access time stamps, which are stored (by Netlify) for less than 30 days.
                </p>
                <p>
                    Your IP address can be used to determine your rough physical location.
                    If you intend to keep your position secret, you are advised to utilize an anonymizing service such as the <a href="https://www.torproject.org">Tor Network</a>.
                </p>
                <p>
                    Your access time stamp can be used to identify you temporal location.
                    As of today, there is no established method of changing the flow of time.
                </p>
                <p>
                    You should read <a href="https://www.netlify.com/gdpr-ccpa">Netlify's privacy policy</a> as their privacy notice applies.
                </p>

                <h1>Privacy policies of other websites</h1>
                <p>
                    My website contains links to other websites.
                    This privacy policy applies only to my website.
                    So if you click on a link to another website, you should read their privacy policy.
                </p>

                <h1>Changes to my privacy policy</h1>
                <p>
                    I keep my privacy policy under regular review and place any updates on this web page.
                    This privacy policy was last updated on 2 January 2022.
                </p>

                <h1>How to contact me</h1>

                <p>
                    If you have any questions about my privacy policy, please do not hesitate to <Link to="/about">contact me</Link>.
                </p>

                <p>
                    Email me at: <a href={email_link}>{email_name}</a>
                </p>
            </div>

        </Layout>
    );
};
export default Privacy;

export const query = graphql`
query PrivacyData {
  site {
    siteMetadata {
      email {
        name
        link
      }
    }
  }
}
`;
