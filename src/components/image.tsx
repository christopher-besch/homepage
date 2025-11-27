import { convertImageOnPool } from "../worker_pool.js";

const widths = [400, 800, 1200, 1600];

interface ImageProps {
    input: string,
}
export default async function Image(props: ImageProps): Promise<React.ReactNode> {
    const loadPaths = await convertImageOnPool(props.input, widths);
    console.log(loadPaths);

    return <picture>
        <source />
        <img />
    </picture>;
}
