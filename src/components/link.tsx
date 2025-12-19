interface LinkProps {
    text: string,
    href?: string,
    className?: string,
};
export default function Link(props: LinkProps): React.ReactNode {
    const href = props.href == undefined ? "#" : props.href;

    let target = "_blank";
    if (href.startsWith("/") || href.startsWith("#")) {
        // Open on same tab.
        target = "_self";
    }

    return <a className={props.className} href={href} target={target}>{props.text}</a>;
}
