interface ButtonProps {
    text: string,
    href: string,
};
export default function Button(props: ButtonProps): React.ReactNode {
    return <a href={props.href} className="button">{props.text}</a>;
}
