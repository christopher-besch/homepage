import { graphql, Link } from "gatsby";
import { GatsbyImage, getImage, IGatsbyImageData, ImageDataLike } from "gatsby-plugin-image";
import React from "react";
import Layout from "../../components/layout";
import * as styles from "../../styles/projects.module.css";
import { ProjectsPage } from "./__generated__/projects-page";

interface ProjectProps {
    data: ProjectsPage;
}
const Projects: React.FC<ProjectProps> = (props) => {
    const projects = props.data.projects.nodes;
    const contact = props.data.contact?.siteMetadata?.contact as string;
    return (
        <Layout>
            <div className={styles.portfolio}>
                <h2>Portfolio</h2>
                <h3>Projects & Webistes I've built</h3>
                <div className={styles.projects}>
                    {projects.map(project => (
                        <Link to={`/projects/${project.frontmatter?.slug}`} key={project.id}>
                            <div>
                                <GatsbyImage image={getImage(project.frontmatter?.thumb as ImageDataLike) as IGatsbyImageData} alt="project img" />
                                <h3>{project.frontmatter?.title}</h3>
                                <p>{project.frontmatter?.stack}</p>
                            </div>
                        </Link>
                    ))}
                </div>
                <p>Like what you see: Email me at {contact} for a quote!</p>
            </div>
        </Layout>
    );
}
export default Projects;

export const query = graphql`
    query ProjectsPage {
      projects: allMarkdownRemark(sort: {fields: frontmatter___date, order: DESC}) {
        nodes {
          frontmatter {
            slug
            stack
            title
            thumb {
              childImageSharp {
                gatsbyImageData (
                  placeholder: BLURRED
                )
              }
            }
          }
          id
        }
      }
      contact: site {
        siteMetadata {
          contact
        }
      }
    }
`;
