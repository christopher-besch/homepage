import type React from "react";
import { convertImageOnPool } from "../worker_pool.js";

const widths = [400, 800, 1200, 1600];

interface ImageProps {
    input: string,
    alt?: string,
    // TODO: lazy img?
}
export default async function Image(props: ImageProps): Promise<React.ReactNode> {
    const sizes = await convertImageOnPool(props.input, widths);
    console.log(sizes);

    return <picture className="image_picture">
        {/* {Array.from(sizes.map((size, _) => */}
        {/*     <source key={size.width} type="image/webp" width={size.width} height={size.height} media={`(max-width: ${size.width}px)`} srcSet={size.loadPath} /> */}
        {/* ))} */}
        <img src={sizes[0]!.loadPath + "d"} width={sizes[0]!.width} height={sizes[0]!.height} alt={props.alt} style={sizes[0]!.lqip} />
    </picture>;
}
