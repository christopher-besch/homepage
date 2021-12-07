import { getImage, GatsbyImage, IGatsbyImageData, ImageDataLike } from "gatsby-plugin-image";
import React from "react";
import { Link } from "gatsby";

import * as styles from "../styles/project_list.module.scss";

export type Project = {
    id: number;
    languages: string;
    priority: number;
    dependencies: string[];
    description: string;
    slug: string;
    title: string;
    thumb: IGatsbyImageData;
}

export function gql_to_project(project: any): Project {
    return {
        id: project.node.id,
        languages: project.node.frontmatter?.languages,
        priority: parseInt(project.node.frontmatter?.priority),
        dependencies: project.node.frontmatter?.dependencies,
        description: project.node.frontmatter?.description,
        slug: project.node.frontmatter?.slug,
        title: project.node.frontmatter?.title,
        thumb: getImage(project.node.frontmatter?.thumb as ImageDataLike)!,
    };
}

interface ProjectListProps {
    projects: Project[];
}
const ProjectList: React.FC<ProjectListProps> = (props) =>
    <div className={styles.projects}>
        {props.projects.map(project =>
            <Link to={`/project/${project.slug}`} key={project.id} className={styles.project}>
                <div className={styles.content}>
                    <GatsbyImage image={project.thumb} alt="thumbnail" />
                    <h3>{project.title} - {project.priority}</h3>
                    <p>{project.description}</p>
                </div>
            </Link>
        )}
    </div>;
export default ProjectList;
