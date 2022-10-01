import { getImage, GatsbyImage } from "gatsby-plugin-image";
import React from "react";
import * as styles from "src/styles/project_list.module.scss";
import { languages } from "src/utils/languages";
import HoverIcon from "./hover_icon";
export function gql_to_project(project) {
    return {
        id: project.node.id,
        date: project.node.frontmatter?.date,
        languages: project.node.frontmatter?.languages.map((language) => languages.get(language)),
        priority: parseInt(project.node.frontmatter?.priority),
        dependencies: project.node.frontmatter?.dependencies,
        description: project.node.frontmatter?.description,
        slug: project.node.frontmatter?.slug,
        link: project.node.frontmatter?.link,
        title: project.node.frontmatter?.title,
        thumb: getImage(project.node.frontmatter?.thumb),
    };
}
const ProjectList = (props) => {
    const count = props.count;
    const full_width = `${100 / count}%`;
    const half_width = `${100 / Math.ceil(count / 2)}%`;
    const quarter_width = `${100 / Math.ceil(count / 4)}%`;
    let width_properties = {
        "--full-width": full_width,
        "--half-width": half_width,
        "--quarter-width": quarter_width,
    };
    return (React.createElement("div", { className: `${styles.projects} ${props.className}` }, props.projects.map(project => React.createElement("a", { href: project.link, target: "_blank", key: project.id, className: styles.project, style: width_properties },
        React.createElement("div", { className: styles.content },
            React.createElement("div", { className: styles.image_wrapper },
                React.createElement(GatsbyImage, { className: styles.image, image: project.thumb, alt: "thumbnail" }),
                React.createElement("div", { className: styles.overlay },
                    React.createElement("h2", { className: styles.heading }, project.title),
                    React.createElement("div", { className: styles.languages }, project.languages.map(language => React.createElement(HoverIcon, { className: styles.language_icon, key: `${project.id}${language.id}`, icon: language.icon, icon_mono: language.icon_mono, alt: language.id, icon_class: styles.icon, icon_mono_class: styles.icon_mono }))))),
            React.createElement("hr", null),
            React.createElement("div", { className: styles.text },
                React.createElement("p", null, project.description)))))));
};
export default ProjectList;
