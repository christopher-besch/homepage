import type { Asset } from "../assets.js";
import { getAssetRoute } from "../paths.js";
import Image from "./image.js";
import Link from "./link.js";

interface PhotosListProps {
    assets: Asset[],
}
export default function PhotosList(props: PhotosListProps): React.ReactNode {
    if (props.assets.filter(a => !a.listed).length) {
        throw new Error("Created a list of unlisted assets.");
    }
    return (
        <div className="photos_list">
            {props.assets.map((asset, i) =>
                <Link key={i} className="photos_list_card" href={getAssetRoute(asset.id)}>
                    <Image inputPath={asset.cachePath} lazy={true} />
                </Link>
            )}
        </div>
    );
}
