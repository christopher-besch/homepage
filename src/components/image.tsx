import type React from "react";
import { convertImageOnPool } from "../worker_pool.js";

const widths = [400, 800, 1200, 1600];

interface ImageProps {
    input: string,
    alt?: string,
    // When we use object-fit: cover and we use a landscape photo on a portrait device, we might want to create a separate image for this purpose.
    // The other direction (using a portrait image on a landscape device) would be possible, too, but isn't implemented.
    // TODO:
    portraitVersion?: {
        objectFitPositionH: number,
    },
    // TODO: lazy img?
}
export default async function Image(props: ImageProps): Promise<React.ReactNode> {
    const exportedImage = await convertImageOnPool({
        input: props.input,
        widths: widths,
        lqipWidth: 3,
        lqipHeight: 3,
    });

    const defaultWidth = exportedImage.sizes[0]!.width;
    const defaultHeight = exportedImage.sizes[0]!.height;
    const lqip = exportedImage.sizes[0]!.lqip;
    const defaultSrcSet = exportedImage.sizes.map((size, _) => `${size.loadPath} ${size.width}w`).join(",");

    return <picture className="image_picture" >
        <source srcSet={defaultSrcSet} type="image/webp" width={defaultWidth} height={defaultHeight} media={`(max-width: 10000px)`} />
        {/* {Array.from(sizes.map((size, _) => */}
        {/*     <source key={size.width} type="image/webp" width={size.width} height={size.height} media={`(max-width: 10000px)`} srcSet={size.loadPath} /> */}
        {/* ))} */}
        <img srcSet={defaultSrcSet} width={defaultWidth} height={defaultHeight} alt={props.alt} style={lqip} />
    </picture>;
}
