import Layout from "./layout.js";
import Image from "./image.js";
import Title from "./title.js";
import Button from "./button.js";
import PhotosList from "./photos_list.js";
import { getNearestListedNeighbours } from "../embedding.js";
import { loadPhotographyPath } from "../paths.js";
import type { Asset } from "../assets.js";

const nearestNeighbours = 4;
const antiNeighbours = 2;

interface PhotoPageProps {
    idx: number,
    assets: Asset[],
}
export default function PhotoPage(props: PhotoPageProps): React.ReactNode {
    const similarAssets = getNearestListedNeighbours(props.idx, nearestNeighbours, antiNeighbours, props.assets);
    return (
        <Layout
            title="Chris' Photo"
            styleSheets={["always.css", "default.css"]}
        >
            <div className="photo_page">
                <Image inputPath={props.assets[props.idx]!.cachePath} lazy={false} />
            </div>
            <Title isHero={false} title="Other Photos" />
            <PhotosList assets={similarAssets} />
            <Button href={loadPhotographyPath} text="Furthermore Photos" />
        </Layout>
    );
}
