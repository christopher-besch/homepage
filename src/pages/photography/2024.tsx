import React from "react";
import { graphql, Link, PageProps } from "gatsby";
import { getImage, GatsbyImage, IGatsbyImageData, ImageDataLike } from "gatsby-plugin-image";
import Layout from "src/components/layout";
import SEO from "src/components/seo";

import * as util_styles from "src/styles/utils.module.scss";
import * as photography_styles from "src/styles/photography.module.scss";

const ToVanish = ({ data }: PageProps<Queries.ToVanishQuery>) => {
    let images = new Map<string, IGatsbyImageData>();
    for (let node of data.allFile.nodes)
        images.set(node.name, getImage(node as ImageDataLike)!);

    return (
        <Layout heading="2024" keep_heading_line={true}>
            <div className={photography_styles.photos} >
                <div className={photography_styles.photo_wrapper}>
                    <GatsbyImage className={photography_styles.photo} image={images.get("2024_alpha")!} alt="" />
                </div>
                <div className={photography_styles.photo_wrapper}>
                    <GatsbyImage className={photography_styles.photo} image={images.get("2024_bravo")!} alt="" />
                </div>
                <div className={photography_styles.photo_wrapper}>
                    <GatsbyImage className={photography_styles.photo} image={images.get("2024_charlie")!} alt="" />
                </div>
                <div className={photography_styles.photo_wrapper}>
                    <GatsbyImage className={photography_styles.photo} image={images.get("2024_delta")!} alt="" />
                </div>
                <div className={photography_styles.photo_wrapper}>
                    <GatsbyImage className={photography_styles.photo} image={images.get("2024_echo")!} alt="" />
                </div>
                <div className={photography_styles.photo_wrapper}>
                    <GatsbyImage className={photography_styles.photo} image={images.get("2024_foxtrot")!} alt="" />
                </div>
                <div className={photography_styles.photo_wrapper}>
                    <GatsbyImage className={photography_styles.photo} image={images.get("2024_golf")!} alt="" />
                </div>
            </div>
            <Link className={`${util_styles.block} ${util_styles.link}`} to="/photography">More Photos</Link>
        </Layout >
    );
};
export default ToVanish;

export const query = graphql`
query ToVanish {
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
    <SEO heading="To Vanish" />
);
