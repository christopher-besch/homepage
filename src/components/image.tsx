import { convertImageOnPool } from "../worker_pool.js";

const widths = [400, 800, 1200, 1600];

interface ImageProps {
    input: string,
    alt?: string,
}
export default async function Image(props: ImageProps): Promise<React.ReactNode> {
    const loadPaths = await convertImageOnPool(props.input, widths);
    console.log(loadPaths);

    const fallbackWidth = Math.min(...loadPaths.keys());

    return <picture>
        {Array.from(loadPaths.entries().map(([width, path], _) =>
            <source key={width} media={`(max-width: ${width}px)`} srcSet={path} />
        ))}
        <img src={loadPaths.get(fallbackWidth)} alt={props.alt} />
    </picture>;
}
