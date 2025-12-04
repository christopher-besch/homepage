import HalfElement from "./half_element.js";
import Image from "./image.js";

interface HalfImageProps {
    inputPath: string;
    alt?: string;
    // should spread entire width?
    full?: boolean;
}
export default function HalfImage(props: HalfImageProps): React.ReactNode {
    return (
        <div className="half_image_image">
            <HalfElement full={props.full}>
                <Image inputPath={props.inputPath} alt={props.alt} lazy={true} />
            </HalfElement>
        </div>
    );
}
