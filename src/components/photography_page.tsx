import Layout from "./layout.js";
import Title from "./title.js";
import PhotosList from "./photos_list.js";
import type { Asset } from "../assets.js";

interface PhotographyPageProps {
    portfolio: Asset[],
}
export default function PhotographyPage(props: PhotographyPageProps): React.ReactNode {
    const portfolioToShow = props.portfolio.sort((a, b) => b.rating - a.rating);
    return (
        <Layout
            title="Chris' Photos"
            styleSheets={["always.css", "default.css"]}
        >
            <Title isHero={false} title="Photos" />
            <PhotosList assets={portfolioToShow} />
        </Layout>
    );
}
