import React from "react";
import { graphql, Link, PageProps } from "gatsby";
import { getImage, GatsbyImage, IGatsbyImageData, ImageDataLike } from "gatsby-plugin-image";
import Layout from "src/components/layout";
import SEO from "src/components/seo";

import * as util_styles from "src/styles/utils.module.scss";
import * as photography_styles from "src/styles/photography.module.scss";

const Photography2023 = ({ data }: PageProps<Queries.ToVanishQuery>) => {
    let images = new Map<string, IGatsbyImageData>();
    let image_sources = new Map<string, string>();
    for (let node of data.allFile.nodes) {
        let image = getImage(node as ImageDataLike)!;
        images.set(node.name, image);
        // This is super ugly but I can't be bothered doing this properly before getting away from Gatsby.
        image_sources.set(node.name, image.images.sources?.at(0)?.srcSet.replaceAll("\n", " ").split(" ").at(-2)!);
    }

    return (
        <Layout heading="2023" keep_heading_line={true}>
            <div className={photography_styles.photos} >
                <a href={image_sources.get("2023_alpha")} target="_blank" className={photography_styles.photo_wrapper}>
                    <GatsbyImage className={photography_styles.photo} image={images.get("2023_alpha")!} alt="" />
                </a>
                <a href={image_sources.get("2023_bravo")} target="_blank" className={photography_styles.photo_wrapper}>
                    <GatsbyImage className={photography_styles.photo} image={images.get("2023_bravo")!} alt="" />
                </a>
                <a href={image_sources.get("2023_charlie")} target="_blank" className={photography_styles.photo_wrapper}>
                    <GatsbyImage className={photography_styles.photo} image={images.get("2023_charlie")!} alt="" />
                </a>
                <a href={image_sources.get("2023_delta")} target="_blank" className={photography_styles.photo_wrapper}>
                    <GatsbyImage className={photography_styles.photo} image={images.get("2023_delta")!} alt="" />
                </a>
                <a href={image_sources.get("2023_echo")} target="_blank" className={photography_styles.photo_wrapper}>
                    <GatsbyImage className={photography_styles.photo} image={images.get("2023_echo")!} alt="" />
                </a>
                <a href={image_sources.get("2023_foxtrot")} target="_blank" className={photography_styles.photo_wrapper}>
                    <GatsbyImage className={photography_styles.photo} image={images.get("2023_foxtrot")!} alt="" />
                </a>
            </div>
            <Link className={`${util_styles.block} ${util_styles.link}`} to="/photography">More Photos</Link>
        </Layout >
    );
};
export default Photography2023;

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
    <SEO heading="Photography 2023" />
);
