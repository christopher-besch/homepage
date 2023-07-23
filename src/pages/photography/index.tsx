import React from "react";
import { graphql, Link, PageProps } from "gatsby";
import { getImage, GatsbyImage, IGatsbyImageData, ImageDataLike } from "gatsby-plugin-image";
import Layout from "src/components/layout";
import SEO from "src/components/seo";

import * as util_styles from "src/styles/utils.module.scss";
import * as photography_styles from "src/styles/photography.module.scss";

const Photography = ({ data }: PageProps<Queries.PhotographyQuery>) => {
    return (
        <Layout heading="Photography">
            <Link to="/photography/to_vanish"><GatsbyImage className={photography_styles.slim_photo} image={getImage(data.to_vanish as ImageDataLike)!} alt="alpha_mike" /></Link>
            <Link className={`${util_styles.block} ${util_styles.link}`} to="/photography/to_vanish">To Vanish</Link>

            <Link to="/photography/leaving_home"><GatsbyImage className={photography_styles.slim_photo} image={getImage(data.leaving_home as ImageDataLike)!} alt="alpha_mike" /></Link>
            <Link className={`${util_styles.block} ${util_styles.link}`} to="/photography/leaving_home">Leaving Home</Link>

            <Link to="/photography/transient"><GatsbyImage className={photography_styles.slim_photo} image={getImage(data.transient as ImageDataLike)!} alt="alpha_mike" /></Link>
            <Link className={`${util_styles.block} ${util_styles.link}`} to="/photography/transient">Transient</Link>
        </Layout >
    );
};
export default Photography;

export const query = graphql`
query Photography {
  to_vanish: file(sourceInstanceName: {eq: "photography"}, name: {eq: "alpha_mike"}) {
    childImageSharp {
      gatsbyImageData(placeholder: BLURRED)
    }
  }
  leaving_home: file(sourceInstanceName: {eq: "photography"}, name: {eq: "alpha_november"}) {
    childImageSharp {
      gatsbyImageData(placeholder: BLURRED)
    }
  }
  transient: file(sourceInstanceName: {eq: "photography"}, name: {eq: "alpha_oscar"}) {
    childImageSharp {
      gatsbyImageData(placeholder: BLURRED)
    }
  }
}
`;

export const Head = () => (
    <SEO heading="Photography" />
);
