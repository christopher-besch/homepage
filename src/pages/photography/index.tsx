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
            <Link to="/photography/2025"><GatsbyImage className={photography_styles.slim_photo} image={getImage(data.thumb_2025 as ImageDataLike)!} alt="" /></Link>
            <Link className={`${util_styles.block} ${util_styles.link}`} to="/photography/2025">⇢ 2025</Link>

            <Link to="/photography/2024"><GatsbyImage className={photography_styles.slim_photo} image={getImage(data.thumb_2024 as ImageDataLike)!} alt="" /></Link>
            <Link className={`${util_styles.block} ${util_styles.link}`} to="/photography/2024">⇢ 2024</Link>

            <Link to="/photography/2023"><GatsbyImage className={photography_styles.slim_photo} image={getImage(data.thumb_2023 as ImageDataLike)!} alt="" /></Link>
            <Link className={`${util_styles.block} ${util_styles.link}`} to="/photography/2023">⇢ 2023</Link>

            <Link to="/photography/before"><GatsbyImage className={photography_styles.slim_photo} image={getImage(data.thumb_before as ImageDataLike)!} alt="" /></Link>
            <Link className={`${util_styles.block} ${util_styles.link}`} to="/photography/before">⇢ Before</Link>
        </Layout >
    );
};
export default Photography;

export const query = graphql`
query Photography {
  thumb_2025: file(sourceInstanceName: {eq: "photography"}, name: {eq: "2025_bravo_slim"}) {
    childImageSharp {
      gatsbyImageData(placeholder: BLURRED)
    }
  }
  thumb_2024: file(sourceInstanceName: {eq: "photography"}, name: {eq: "2024_bravo_slim"}) {
    childImageSharp {
      gatsbyImageData(placeholder: BLURRED)
    }
  }
  thumb_2023: file(sourceInstanceName: {eq: "photography"}, name: {eq: "2023_delta_slim"}) {
    childImageSharp {
      gatsbyImageData(placeholder: BLURRED)
    }
  }
  thumb_before: file(sourceInstanceName: {eq: "photography"}, name: {eq: "2019_alpha_slim"}) {
    childImageSharp {
      gatsbyImageData(placeholder: BLURRED)
    }
  }
}
`;

export const Head = () => (
    <SEO heading="Photography" />
);
