import type { Article } from "../articles.js";
import type { Asset } from "../assets.js";
import { toTitleCase } from "../conversion.js";
import { loadArticlesPath, loadPhotographyPath, loadProjectsPath, loadTalksPath } from "../paths.js";
import type { Project } from "../projects.js";
import type { Talk } from "../talks.js";
import Button from "./button.js";
import CardsList from "./cards_list.js";
import Layout from "./layout.js";
import PhotosList from "./photos_list.js";
import Title from "./title.js";

interface TagPageProps {
    route: string,
    tag: string,
    portfolio: Asset[],
    articles: Article[],
    talks: Talk[],
    projects: Project[],
}
export default function TagPage(props: TagPageProps): React.ReactNode {
    const projectsToShow = props.projects
        .filter(a => a.listed && a.tags.includes(props.tag))
        .sort((a, b) => a.priority - b.priority);
    const talksToShow = props.talks
        .filter(a => a.listed && a.tags.includes(props.tag))
        // Date must be defined for all listed talks.
        .sort((a, b) => b.date!.getTime() - a.date!.getTime());
    const articlesToShow = props.articles
        .filter(a => a.listed && a.tags.includes(props.tag))
        // Date must be defined for all listed articles.
        .sort((a, b) => b.date!.getTime() - a.date!.getTime());
    const portfolioToShow = props.portfolio
        .filter(a => a.tags.includes(props.tag))
        .sort((a, b) => b.rating - a.rating);
    const tag = toTitleCase(props.tag);
    return (
        <Layout
            route={props.route}
            title={`Tag: ${props.tag}`}
            styleSheets={["always.css", "default.css"]}
        >
            {articlesToShow.length != 0 ?
                <>
                    <Title isHero={false} title={`Articles: ${tag}`} />
                    <CardsList cards={articlesToShow} />
                    <Button href={loadArticlesPath} text="More Articles" />
                </>
                : undefined}
            {talksToShow.length != 0 ?
                <>
                    <Title isHero={false} title={`Talks: ${tag}`} />
                    <CardsList cards={talksToShow} />
                    <Button href={loadTalksPath} text="More Talks" />
                </>
                : undefined}
            {projectsToShow.length != 0 ?
                <>
                    <Title isHero={false} title={`Software Projects: ${tag}`} />
                    <CardsList cards={projectsToShow} />
                    <Button href={loadProjectsPath} text="More Software Projects" />
                </>
                : undefined}
            {portfolioToShow.length != 0 ?
                <>
                    <Title isHero={false} title={`Photography: ${tag}`} />
                    <PhotosList assets={portfolioToShow} />
                    <Button href={loadPhotographyPath} text="More Photos" />
                </>
                : undefined}
        </Layout>
    );
}
