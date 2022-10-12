import React from "react";
import { Link, graphql, PageProps } from "gatsby";

import Layout from "src/components/layout";
import SEO from "src/components/seo";
import * as styles from "src/styles/privacy.module.scss";
import * as util_styles from "src/styles/utils.module.scss";

const Privacy = ({ data }: PageProps<Queries.PrivacyQuery>) => {
    const email_name = data.site?.siteMetadata?.privacy_email?.name as string;
    const email_link = data.site?.siteMetadata?.privacy_email?.link as string;

    return (
        <Layout heading="Privacy Policy">
            <div className={`${styles.privacy} ${util_styles.main_block}`}>
                <p>
                    This privacy policy will explain how I and any necessary third-party services use the personal data collected from you when you use my website.
                </p>

                <h1>What data do I collect?</h1>
                <p>
                    This website uses <a href="https://www.cloudflare.com/en-gb/web-analytics">Cloudflare Web Analytics</a>, which collects the following data:
                    <ul>
                        <li>time of access,</li>
                        <li>what page you read,</li>
                        <li>your operating system (Linux, Windows, MacOS, Android, iOS, ...),</li>
                        <li>your browser,</li>
                        <li>if you're using a mobile device,</li>
                        <li>the referer (i.e. the page that linked you to my homepage),</li>
                        <li>from what country you're accesing my homepage and</li>
                        <li>some website diagnostics, like how long my homepage takes to load for you.</li>
                    </ul>
                </p>
                <p>
                    This data is anonymized.
                    So I for example only know that ten people from Belgium visited my <Link to="/articles/revealjs">article about reveal.js</Link> this month—not that <b>you</b> visited my page.
                </p>
                <p>
                    This data is only accessible by Cloudflare (for six months) and myself.
                    Short overviews of the data are kept indefinitely by me and I might publish them in the future.
                </p>
                <p>
                    This data is used to help me understand what topics people are interested in.
                </p>

                <p>
                    In addition to that, my hoster <a href="https://www.netlify.com">Netlify</a> keeps an access log required to operate this website.
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
                    This privacy policy was last updated on 12th October 2022.
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

export const Head = () => (
    <SEO heading="Privacy Policy" />
);

