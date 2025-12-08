import type { Asset } from "../immich.js";
import { getAssetDeployRoute } from "../paths.js";
import Image from "./image.js";

interface PhotosListProps {
    assets: Asset[],
}
export default function PhotosList(props: PhotosListProps): React.ReactNode {
    if (props.assets.filter(a => !a.listed).length) {
        throw new Error("Created a list of unlisted assets.");
    }
    return (
        <div className="assets_list">
            {props.assets.map((asset, i) =>
                <a key={i} className="assets_list_card" href={getAssetDeployRoute(asset.id)}>
                    <Image inputPath={asset.cachePath} lazy={true} />
                </a>
            )}
        </div>
    );
}
