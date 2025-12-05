interface ButtonProps {
    text: string,
    href: string,
};
export default function Button(props: ButtonProps): React.ReactNode {
    return <div className="button" ><a href={props.href}>{props.text}</a></div>;
}
