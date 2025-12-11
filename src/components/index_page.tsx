import type { Article } from "../articles.js";
import type { Asset } from "../assets.js";
import { getResourceLoadPath, loadArticlesPath, loadPhotographyPath, loadProjectsPath, loadTalksPath } from "../paths.js";
import type { Project } from "../projects.js";
import type { Talk } from "../talks.js";
import Button from "./button.js";
import CardsList from "./cards_list.js";
import Layout from "./layout.js";
import PhotosList from "./photos_list.js";
import Title from "./title.js";

interface IndexPageProps {
    portfolio: Asset[],
    articles: Article[],
    talks: Talk[],
    projects: Project[],
}
export default function IndexPage(props: IndexPageProps): React.ReactNode {
    const projectsToShow = props.projects
        .filter(a => a.listed)
        .sort((a, b) => a.priority - b.priority).slice(0, 2);
    const talksToShow = props.talks
        .filter(a => a.listed)
        // Date must be defined for all listed talks.
        .sort((a, b) => b.date!.getTime() - a.date!.getTime()).slice(0, 2);
    const articlesToShow = props.articles
        .filter(a => a.listed)
        // Date must be defined for all listed articles.
        .sort((a, b) => b.date!.getTime() - a.date!.getTime()).slice(0, 2);
    const portfolioToShow = props.portfolio.sort((a, b) => b.rating - a.rating).slice(0, 6);
    return (
        <Layout
            title="Chris' Homepage"
            styleSheets={["always.css", "default.css"]}
            heroImage={{
                inputPath: getResourceLoadPath("index_hero.jpg"),
                objectFitHorizontal: 65,
                objectFitVertical: 30,
                children: <div>Hello World</div>,
            }}>
            <div className="index_page_div">
                <Title isHero={false} title="Articles" />
                <CardsList cards={articlesToShow} />
                <Button href={loadArticlesPath} text="More Articles" />

                <Title isHero={false} title="Photography" />
                <PhotosList assets={portfolioToShow} />
                <Button href={loadPhotographyPath} text="More Photos" />

                <Title isHero={false} title="Software Projects" />
                <CardsList cards={projectsToShow} />
                <Button href={loadProjectsPath} text="More Software Projects" />

                <Title isHero={false} title="Talks" />
                <CardsList cards={talksToShow} />
                <Button href={loadTalksPath} text="More Talks" />
            </div>
        </Layout>
    );
}
