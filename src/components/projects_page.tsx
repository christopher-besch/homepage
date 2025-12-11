import type { Project } from "../projects.js";
import CardsList from "./cards_list.js";
import Layout from "./layout.js";
import Title from "./title.js";

interface ProjectsPageProps {
    projects: Project[],
}
export default function ProjectsPage(props: ProjectsPageProps): React.ReactNode {
    const projectssToShow = props.projects
        .filter(a => a.listed)
        .sort((a, b) => a.priority - b.priority);
    return (
        <Layout
            title="Chris' Projects"
            styleSheets={["always.css", "default.css"]}>
            <Title isHero={false} title="Projects" />
            <CardsList cards={projectssToShow} />
        </Layout>
    );
}
