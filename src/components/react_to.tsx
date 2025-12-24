import Button from "./button.js";
import TagsList from "./tags_list.js";

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
        <TagsList tags={props.tags} />
        <Button onClick={likeJS} text="👍 I like this!" />
        <div className="react_to_comment">
            <textarea id="react_to_comment_input" placeholder="Your Comment..." />
            <Button onClick={commentJS} text="Send Comment" />
        </div>
    </div>;
}

