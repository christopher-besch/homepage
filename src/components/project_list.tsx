import { getImage, GatsbyImage, IGatsbyImageData, ImageDataLike } from "gatsby-plugin-image";
import React from "react";

import * as styles from "src/styles/project_list.module.scss";
import { Language, languages } from "src/utils/languages";
import get_mask from "src/utils/svg_mask";

export type Project = {
    id: number;
    date: string;
    languages: Language[];
    priority: number;
    dependencies: string[];
    description: string;
    slug: string;
    link: string;
    title: string;
    thumb: IGatsbyImageData;
}

export function gql_to_project(project: any): Project {
    return {
        id: project.node.id,
        date: project.node.frontmatter?.date,
        languages: project.node.frontmatter?.languages.map((language: string) => languages.get(language)),
        priority: parseInt(project.node.frontmatter?.priority),
        dependencies: project.node.frontmatter?.dependencies,
        description: project.node.frontmatter?.description,
        slug: project.node.frontmatter?.slug,
        link: project.node.frontmatter?.link,
        title: project.node.frontmatter?.title,
        thumb: getImage(project.node.frontmatter?.thumb as ImageDataLike)!,
    };
}

interface ProjectListProps {
    projects: Project[];
    count?: number;
}
const ProjectList: React.FC<ProjectListProps> = (props) => {
    const count = props.count ? props.count : 4;
    const full_width = `${100 / count}%`;
    const half_width = `${100 / Math.ceil(count / 2)}%`;
    const quarter_width = `${100 / Math.ceil(count / 4)}%`;
    let width_properties = {
        "--full-width": full_width,
        "--half-width": half_width,
        "--quarter-width": quarter_width,
    } as React.CSSProperties;
    return (
        <div className={styles.projects}>
            {props.projects.map(project =>
                // TODO: can't link same project twice <- non-unique key
                <a href={project.link} key={`${project.id}`} className={styles.project} style={width_properties}>
                    <div className={styles.content}>
                        <div className={styles.image}>
                            <GatsbyImage image={project.thumb} alt="thumbnail" />
                            <div className={styles.overlay}>
                                {project.languages.map(language =>
                                    <div
                                        className={styles.language_icon}
                                        style={get_mask(language.icon_mono)}
                                        key={`${project.id}${language.id}`}
                                    ></div>
                                )}
                            </div>
                        </div>
                        <h3>{project.title}</h3>
                        <p>{project.description}</p>
                    </div>
                </a>
            )}
        </div>);
};
export default ProjectList;
