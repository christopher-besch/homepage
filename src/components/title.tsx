import { Fragment } from "react/jsx-dev-runtime";
import { getTagRoute } from "../paths.js";
import Link from "./link.js";

interface TitleProps {
    isHero: boolean,
    title: string,
    subtitle?: {
        left: string,
        right?: string,
        tags?: string[],
    }
}
export default function Title(props: TitleProps): React.ReactNode {
    return <div className={props.isHero ? "title_in_hero" : "title_in_text"} >
        <h1>{props.title}</h1>
        <hr />
        {props.subtitle != undefined ? <h2>
            {props.subtitle.left}
            {props.subtitle.right != undefined ?
                <span> {props.subtitle.right}
                    {(props.subtitle.tags != undefined ? props.subtitle.tags : []).map((tag, idx) =>
                        <Fragment key={idx}> <Link href={getTagRoute(tag)}>#{tag}</Link></Fragment>
                    )}</span>
                : undefined}
        </h2> : undefined}
    </div>;
}
