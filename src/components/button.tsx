interface ButtonProps {
    text: string,
    href: string,
};
export default function Button(props: ButtonProps): React.ReactNode {
    return <a className="button" href={props.href}>{props.text}</a>;
}
