import { Link, graphql, useStaticQuery } from "gatsby";
import { SiteInfo } from "./__generated__/site-info";
import React from "react";

const Navbar: React.FC = () => {
    // can only be used once per page
    // page queries aren't supported here
    const data: SiteInfo = useStaticQuery(graphql`
        query SiteInfo {
          site {
            siteMetadata {
              title
            }
          }
        }
    `);
    const title = data.site?.siteMetadata?.title as string;

    return (
        <nav>
            <h1>{title}</h1>
            <div className="links">
                <Link to="/">Home</Link>
                <Link to="/about">About</Link>
                <Link to="/projects">Projects</Link>
            </div>
        </nav>
    );
}
export default Navbar;
