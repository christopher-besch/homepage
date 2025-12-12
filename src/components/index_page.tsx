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
    const portfolioToShow = props.portfolio.sort((a, b) => b.rating - a.rating).slice(0, 5);
    return (
        <Layout
            title="Chris' Homepage"
            styleSheets={["always.css", "default.css"]}
            heroImage={{
                inputPath: getResourceLoadPath("index_hero.jpg"),
                objectFitHorizontal: 65,
                objectFitVertical: 30,
                children: <div className="index_page_title">
                    <h1>Welcome&nbsp;to Chris'&nbsp;Place!</h1>
                    <h2>What are you here for?</h2>
                    <div className="index_page_links">
                        {/* The icons are google material icons, Apache 2.0 license: https://github.com/google/material-design-icons/blob/master/LICENSE */}
                        <a href={loadArticlesPath}>
                            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f"><path d="M280-280h280v-80H280v80Zm0-160h400v-80H280v80Zm0-160h400v-80H280v80Zm-80 480q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-560H200v560Zm0-560v560-560Z" /></svg>
                            <span>Articles</span>
                        </a>
                        <a href={loadPhotographyPath}>
                            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f"><path d="M360-400h400L622-580l-92 120-62-80-108 140Zm-40 160q-33 0-56.5-23.5T240-320v-480q0-33 23.5-56.5T320-880h480q33 0 56.5 23.5T880-800v480q0 33-23.5 56.5T800-240H320Zm0-80h480v-480H320v480ZM160-80q-33 0-56.5-23.5T80-160v-560h80v560h560v80H160Zm160-720v480-480Z" /></svg>
                            <span>Photography</span>
                        </a>
                        <a href={loadProjectsPath}>
                            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f"><path d="M320-240 80-480l240-240 57 57-184 184 183 183-56 56Zm320 0-57-57 184-184-183-183 56-56 240 240-240 240Z" /></svg>
                            <span>Software Projects</span>
                        </a>
                        <a href={loadTalksPath}>
                            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f"><path d="M840-120v-640H120v320H40v-320q0-33 23.5-56.5T120-840h720q33 0 56.5 23.5T920-760v560q0 33-23.5 56.5T840-120ZM360-400q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47Zm0-80q33 0 56.5-23.5T440-560q0-33-23.5-56.5T360-640q-33 0-56.5 23.5T280-560q0 33 23.5 56.5T360-480ZM40-80v-112q0-34 17.5-62.5T104-298q62-31 126-46.5T360-360q66 0 130 15.5T616-298q29 15 46.5 43.5T680-192v112H40Zm80-80h480v-32q0-11-5.5-20T580-226q-54-27-109-40.5T360-280q-56 0-111 13.5T140-226q-9 5-14.5 14t-5.5 20v32Zm240-400Zm0 400Z" /></svg>
                            <span>Talks</span>
                        </a>
                    </div>
                </div>,
            }}>
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
        </Layout>
    );
}
