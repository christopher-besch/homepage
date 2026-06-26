import { copyVideo } from "../paths.js";
import HalfElement from "./half_element.js";

interface HalfVideoProps {
    inputPath: string;
    // Should be prefixed with `vid:` or similar.
    id?: string;
    caption?: string;
    elements: string[];

    width?: number;
    height?: number;
    // should spread entire width?
    full?: boolean;
}
export default async function AutoPlayVideo(props: HalfVideoProps): Promise<React.ReactNode> {
    const deployPath = await copyVideo(props.inputPath);
    return (
        <HalfElement id={props.id} caption={props.caption} elements={props.elements} full={props.full}>
            <p className="half_video_removed_warn">[video removed from print]</p>
            {/* show in print version if poster defined */}
            <video
                className="half_video_video"
                controls loop muted autoPlay playsInline
                width={props.width ? props.width : 1920}
                height={props.height ? props.height : 1080}>
                <source src={deployPath} type="video/mp4" />
            </video>
        </HalfElement>
    );
}
