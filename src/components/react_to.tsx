import Button from "./button.js";

interface ReactToProps {
    route: string,
};
export default function ReactTo(props: ReactToProps): React.ReactNode {
    // The route prop is needed because umami doesn't store the url properly.
    return <Button onClick={`umami.track('like', {route: '${props.route}'}).then(()=>{this.innerText='Thx!';this.onclick=null;});`} text="👍 I like this!" />;
}

