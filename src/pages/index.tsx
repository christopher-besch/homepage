import React from "react";
import { graphql, Link } from "gatsby";
import { GatsbyImage, getImage, IGatsbyImageData, ImageDataLike } from "gatsby-plugin-image";
import Layout from "../components/layout";
import * as styles from "../styles/home.module.css";
import { Banner } from "./__generated__/banner";

interface HomeProps {
    data: Banner;
}
const Home: React.FC<HomeProps> = (props) => {
    const banner = getImage(props.data.banner as ImageDataLike) as IGatsbyImageData;
    console.log(props.data.banner);
    return (
        <Layout>
            <section className={styles.header}>
                <div>
                    <h2>Design</h2>
                    <h3>Develop</h3>
                    <p>Stuff to do</p>
                    <Link className={styles.btn} to="/projects">My Portfolio Projects</Link>
                </div>
                <GatsbyImage image={banner} alt="pretty banner" />
            </section>
        </ Layout>
    )
};
export default Home;

export const query = graphql`
    query Banner {
      banner: file(relativePath: {eq: "banner.png"}) {
        childImageSharp {
          gatsbyImageData(
            placeholder: BLURRED
          )
        }
      }
    }
`;
