import React from "react";
import { graphql, Link, PageProps } from "gatsby";
import { getImage, GatsbyImage, IGatsbyImageData, ImageDataLike } from "gatsby-plugin-image";
import Layout from "src/components/layout";
import SEO from "src/components/seo";

import * as util_styles from "src/styles/utils.module.scss";
import * as photography_styles from "src/styles/photography.module.scss";

const Transient = ({ data }: PageProps<Queries.TransientQuery>) => {
    let images = new Map<string, IGatsbyImageData>();
    for (let node of data.allFile.nodes)
        images.set(node.name, getImage(node as ImageDataLike)!);

    return (
        <Layout heading="Transient" keep_heading_line={true}>
            <div className={photography_styles.photos} >
                <div className={photography_styles.photo_wrapper}>
                    <GatsbyImage className={photography_styles.photo} image={images.get("alpha_india")!} alt="alpha_india" />
                </div>
                <div className={photography_styles.photo_wrapper}>
                    <GatsbyImage className={photography_styles.photo} image={images.get("alpha_hotel")!} alt="alpha_hotel" />
                </div>
                <div className={photography_styles.photo_wrapper}>
                    <GatsbyImage className={photography_styles.photo} image={images.get("alpha_golf")!} alt="alpha_golf" />
                </div>
                <div className={photography_styles.photo_wrapper}>
                    <GatsbyImage className={photography_styles.photo} image={images.get("alpha_juliett")!} alt="alpha_juliett" />
                </div>
            </div>
            <Link className={`${util_styles.block} ${util_styles.link}`} to="/photography">More Photos</Link>
        </Layout >
    );
};
export default Transient;

export const query = graphql`
query Transient {
  allFile(filter: {sourceInstanceName: {eq: "photography"}}) {
    nodes {
      childImageSharp {
        gatsbyImageData(placeholder: BLURRED)
      }
      name
    }
  }
}
`;

export const Head = () => (
    <SEO heading="Transient" />
);
