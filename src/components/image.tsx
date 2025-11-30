import type React from "react";
import { convertImageOnPool } from "../worker_pool.js";
import type { ImageSize } from "../worker.js";

const defaultWidths = [400, 800, 1200, 1600];
const portraitAspectRatio = 9 / 16;
const portraitWidths = [400, 800];
// On portrait devices with relatively wide screens (i.e. a square device) there is a jump when we switch to the portrait image.
// This is because an almost square device that is small enough will render the portrait image but should actually show some more of the edges of the image (i.e., the landscape image would be better).
// This can't easily be solved because such devices have a small width and appear as a portrait device.
// Therefore the media query in the picture sources can't differentiate between these two types of devices.
// We keep this because it really isn't much of a problem.
// Firstly, these kinds of devices don't really exist anyways.
// Secondly, the jump is not a big issue.
const portraitMaxWidth = 500;

interface ImageProps {
    input: string,
    alt?: string,
    // When we use object-fit: cover and we use a landscape photo on a portrait device, we might want to create a separate image for this purpose.
    // The other direction (using a portrait image on a landscape device) would be possible, too, but isn't implemented.
    portraitVersion?: {
        objectFitPositionH: number,
    },
    // TODO: lazy img?
}

function sizesToSrcSet(sizes: ImageSize[]): string {
    return sizes.map((size, _) => `${size.loadPath} ${size.width}w`).join(",");
}

export default async function Image(props: ImageProps): Promise<React.ReactNode> {
    const exportedImage = await convertImageOnPool({
        input: props.input,
        widths: defaultWidths,
        lqipWidth: 3,
        lqipHeight: 3,
        portraitVersion: props.portraitVersion != undefined ? {
            objectFitPositionH: props.portraitVersion.objectFitPositionH,
            aspectRatio: portraitAspectRatio,
            widths: portraitWidths,
        } : undefined,
    });

    const defaultWidth = exportedImage.sizes[0]!.width;
    const defaultHeight = exportedImage.sizes[0]!.height;
    const lqip = exportedImage.lqip;
    const defaultSrcSet = sizesToSrcSet(exportedImage.sizes);

    if ((exportedImage.portraitSizes == undefined) != (props.portraitVersion == undefined)) {
        throw new Error("portrait undefined mismatch");
    }

    const imgTag = <img srcSet={defaultSrcSet} width={defaultWidth} height={defaultHeight} alt={props.alt} style={lqip} />;
    if (exportedImage.portraitSizes != undefined) {
        const portraitSrcSet = sizesToSrcSet(exportedImage.portraitSizes)
        const portraitWidth = exportedImage.portraitSizes[0]!.width;
        const portraitHeight = exportedImage.portraitSizes[0]!.height;
        // We use the original landscape image for landscape devices and for thinner portrait ones we use the portrait image.
        // This cuts down on the needed bandwidth because we only load a smaller image while keeping image resolution high.
        return <picture className="image_picture" >
            <source srcSet={defaultSrcSet} type="image/webp" width={defaultWidth} height={defaultHeight} media={`(orientation: landscape)`} />
            {/* We don't switch to the portrait image immediately and wait for smaller device widths. */}
            {/* This is because the image is thinner than a perfect square. */}
            <source srcSet={portraitSrcSet} type="image/webp" width={portraitWidth} height={portraitHeight} media={`(orientation: portrait) and (max-width: ${portraitMaxWidth}px)`} />
            {imgTag}
        </picture>;
    }
    // We don't need any source tags when there's no art direction.
    return <picture className="image_picture" >
        <img srcSet={defaultSrcSet} width={defaultWidth} height={defaultHeight} alt={props.alt} style={lqip} />
    </picture>;
}
