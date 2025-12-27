import type { Project } from "../projects.js";
import { sortTags } from "../tags.js";
import CardsList from "./cards_list.js";
import Layout from "./layout.js";
import TagsList from "./tags_list.js";
import Title from "./title.js";

interface ProjectsPageProps {
    route: string,
    projects: Project[],
}
export default function ProjectsPage(props: ProjectsPageProps): React.ReactNode {
    const projectsToShow = props.projects
        .filter(a => a.listed)
        .sort((a, b) => a.priority - b.priority);
    // All projects are software_development.
    const allTags = projectsToShow.flatMap(p => p.tags).filter(t => t != "software_development");
    const tagsList = sortTags(allTags).slice(0, 12);
    return (
        <Layout
            route={props.route}
            title="Chris' Software Projects"
            styleSheets={["always.css", "default.css"]}>
            <Title isHero={false} title="Software Projects" />
            <TagsList tags={tagsList.map(([tag, _n]) => tag)} />
            <CardsList cards={projectsToShow} />
        </Layout>
    );
}
