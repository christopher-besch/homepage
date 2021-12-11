import React from "react";
import { graphql, Link } from "gatsby";
import { HomePage } from "./__generated__/home-page";

import Layout from "src/components/layout";
import ProjectList, { gql_to_project } from "src/components/project_list";
import * as styles from "src/styles/home.module.scss";
import Heading from "src/components/heading";
import HoverIcon from "src/components/hover_icon";

interface HomeProps {
    data: HomePage
}
const Home: React.FC<HomeProps> = (props) => {
    const projects = props.data.allMarkdownRemark.edges.map(gql_to_project);

    return (
        <Layout>
            <Heading heading="Hello Smart People!" sub_heading="I'm a Problem Solver." />
            <div className={styles.first_con}>
                <ProjectList projects={projects} count={2} />
            </div>
            <div className={styles.second_con}>
                <div className={styles.languages}>
                    <Link to="/projects/cpp" className={styles.language}>
                        <HoverIcon className={styles.icon} icon="/icons/c-plusplus.svg" icon_mono="/icons/c-plusplus_mono.svg" alt="C++" />
                    </Link>
                    <Link to="/projects/typescript" className={styles.language}>
                        <HoverIcon className={styles.icon} icon="/icons/typescript-icon.svg" icon_mono="/icons/typescript-icon_mono.svg" alt="TypeScript" />
                    </Link>
                    <Link to="/projects/python" className={styles.language}>
                        <HoverIcon className={styles.icon} icon="/icons/python.svg" alt="Python" />
                    </Link>
                </div>
            </div>
        </Layout>
    );
};
export default Home;

export const query = graphql`
query HomePage {
  allMarkdownRemark(
    filter: {frontmatter: {priority: {gte: 0, lte: 1}}}
    sort: {fields: frontmatter___priority, order: ASC}
  ) {
    edges {
      node {
        id
        frontmatter {
          languages
          priority
          dependencies
          slug
          link
          description
          title
          thumb {
            childImageSharp {
              gatsbyImageData (
                placeholder: BLURRED
              )
            }
          }
          date(formatString: "MMMM YYYY")
        }
      }
    }
  }
}
`;
