import Layout from "./layout.js";
import Image from "./image.js";
import Title from "./title.js";
import Button from "./button.js";
import PhotosList from "./photos_list.js";
import { getNearestListedNeighbours } from "../embedding.js";
import { loadPhotographyPath } from "../paths.js";
import type { Asset } from "../assets.js";
import ReactTo from "./react_to.js";

const nearestNeighbours = 4;
const antiNeighbours = 2;

interface PhotoPageProps {
    route: string,
    idx: number,
    assets: Asset[],
}
export default function PhotoPage(props: PhotoPageProps): React.ReactNode {
    const similarAssets = getNearestListedNeighbours(props.idx, nearestNeighbours, antiNeighbours, props.assets);
    const banner = props.assets[props.idx]!.cachePath;
    return (
        <Layout
            route={props.route}
            banner={banner}
            title="Chris' Photo"
            styleSheets={["always.css", "default.css"]}
        >
            <div className="photo_page">
                <Image inputPath={props.assets[props.idx]!.cachePath} lazy={false} />
            </div>
            <ReactTo route={props.route} tags={props.assets[props.idx]!.tags} />
            <Title isHero={false} title="Other Photos" />
            <PhotosList assets={similarAssets} />
            <Button href={loadPhotographyPath} text="Furthermore Photos" />
        </Layout>
    );
}
