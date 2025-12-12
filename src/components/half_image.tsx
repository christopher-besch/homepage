import { directCopyImage } from "../paths.js";
import HalfElement from "./half_element.js";
import Image from "./image.js";

interface HalfImageProps {
    inputPath: string;
    alt?: string;
    // should spread entire width?
    full?: boolean;
}
export default async function HalfImage(props: HalfImageProps): Promise<React.ReactNode> {
    return (
        <div className="half_image_image">
            <HalfElement full={props.full}>
                {props.inputPath.endsWith(".svg") ? <img src={await directCopyImage(props.inputPath)} loading="lazy" alt="" />
                    : <Image inputPath={props.inputPath} alt={props.alt} lazy={true} />}
            </HalfElement>
        </div>
    );
}
