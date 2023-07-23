import React from "react";
import { graphql, Link, PageProps } from "gatsby";
import { getImage, GatsbyImage, IGatsbyImageData, ImageDataLike } from "gatsby-plugin-image";
import Layout from "src/components/layout";
import SEO from "src/components/seo";

import * as util_styles from "src/styles/utils.module.scss";
import * as photography_styles from "src/styles/photography.module.scss";

const LeavingHome = ({ data }: PageProps<Queries.LeavingHomeQuery>) => {
    let images = new Map<string, IGatsbyImageData>();
    for (let node of data.allFile.nodes)
        images.set(node.name, getImage(node as ImageDataLike)!);

    return (
        <Layout heading="Leaving Home" keep_heading_line={true}>
            <div className={photography_styles.photos} >
                <div className={photography_styles.photo_wrapper}>
                    <GatsbyImage className={photography_styles.photo} image={images.get("alpha_echo")!} alt="alpha_echo" />
                </div>
                <div className={photography_styles.photo_wrapper}>
                    <GatsbyImage className={photography_styles.photo} image={images.get("alpha_foxtrot")!} alt="alpha_foxtrot" />
                </div>
                <div className={photography_styles.photo_wrapper}>
                    <GatsbyImage className={photography_styles.photo} image={images.get("alpha_kilo")!} alt="alpha_kilo" />
                </div>
                <div className={photography_styles.photo_wrapper}>
                    <GatsbyImage className={photography_styles.photo} image={images.get("alpha_lima")!} alt="alpha_lima" />
                </div>
            </div>
            <Link className={`${util_styles.block} ${util_styles.link}`} to="/photography">More Photos</Link>
        </Layout >
    );
};
export default LeavingHome;

export const query = graphql`
query LeavingHome {
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
    <SEO heading="Leaving Home" />
);
