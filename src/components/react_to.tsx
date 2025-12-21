import { Fragment } from "react/jsx-dev-runtime";
import Button from "./button.js";
import Link from "./link.js";
import { getTagRoute } from "../paths.js";

interface ReactToProps {
    route: string,
    tags: string[],
};
export default function ReactTo(props: ReactToProps): React.ReactNode {
    const likeJS = `
umami.track(
    'like',
    {
        route: '${props.route}',
    }
).then(()=>{
    this.innerText = 'Thx!';
    this.onclick = null;
    this.style = 'cursor:default;';
});
`;
    const commentJS = `
umami.track(
    'comment',
    {
        route: '${props.route}',
        comment: document.getElementById('react_to_comment_input').value,
    }
).then(()=>{
    this.innerText = 'Comment Sent';
    this.onclick = null;
    this.style = 'cursor:default;';
    document.getElementById('react_to_comment_input').disabled = true;
});
`;

    // The route prop is needed because umami doesn't store the url properly.
    return <div className="react_to">
        <div className="markdown_body">
            {props.tags.map((tag, idx) =>
                <Fragment key={idx}> <Link href={getTagRoute(tag)}>#{tag}</Link></Fragment>
            )}
        </div>
        <Button onClick={likeJS} text="👍 I like this!" />
        <div className="react_to_comment">
            <textarea id="react_to_comment_input" placeholder="Some Comment..." />
            <Button onClick={commentJS} text="Send Comment" />
        </div>
    </div>;
}

