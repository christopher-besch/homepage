import Layout from "./layout.js";
import Title from "./title.js";
import PhotosList from "./photos_list.js";
import type { Asset } from "../assets.js";

interface PhotographyPageProps {
    portfolio: Asset[],
}
export default function PhotographyPage(props: PhotographyPageProps): React.ReactNode {
    props.portfolio.sort((a, b) => b.rating - a.rating);
    return (
        <Layout
            title="Chris' Photos"
            styleSheets={["always.css", "default.css"]}
        >
            <Title isHero={false} title="Photos" />
            <div className="photography_page_list">
                <PhotosList assets={props.portfolio} />
            </div>
        </Layout>
    );
}
