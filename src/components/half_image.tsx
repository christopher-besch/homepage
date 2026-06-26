import { directCopyImage } from "../paths.js";
import HalfElement from "./half_element.js";
import Image from "./image.js";

interface HalfImageProps {
    inputPath: string;
    alt?: string;
    // Should be prefixed with `fig:` or similar.
    id?: string;
    num?: number;
    caption?: string;
    elements: string[];
    // should spread entire width?
    full?: boolean;
}
export default async function HalfImage(props: HalfImageProps): Promise<React.ReactNode> {
    const alt = props.alt == undefined ? props.caption : props.alt;
    return (
        <div className="half_image_image">
            <HalfElement id={props.id} num={props.num} caption={props.caption} elements={props.elements} full={props.full}>
                {props.inputPath.endsWith(".svg") ? <img src={await directCopyImage(props.inputPath)} loading="lazy" alt={alt} />
                    : <Image inputPath={props.inputPath} alt={alt} lazy={true} />}
            </HalfElement>
        </div>
    );
}
