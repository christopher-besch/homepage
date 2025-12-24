import Layout from "./layout.js";
import Title from "./title.js";
import PhotosList from "./photos_list.js";
import type { Asset } from "../assets.js";
import { sortTags } from "../tags.js";
import TagsList from "./tags_list.js";

interface PhotographyPageProps {
    route: string,
    portfolio: Asset[],
}
export default function PhotographyPage(props: PhotographyPageProps): React.ReactNode {
    const portfolioToShow = props.portfolio.sort((a, b) => b.rating - a.rating);

    // All photos are photography.
    const allTags = portfolioToShow.flatMap(p => p.tags).filter(p => p != "photography");
    const tagsList = sortTags(allTags).slice(0, 10);
    return (
        <Layout
            route={props.route}
            title="Chris' Photos"
            styleSheets={["always.css", "default.css"]}
        >
            <Title isHero={false} title="Photos" />
            <TagsList tags={tagsList.map(([tag, _n]) => tag)} />
            <PhotosList assets={portfolioToShow} />
        </Layout>
    );
}
