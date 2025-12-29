interface LinkProps {
    href?: string,
    className?: string,
};
export default function Link(props: React.PropsWithChildren<LinkProps>): React.ReactNode {
    const href = props.href == undefined ? "#" : props.href;

    let target = "_blank";
    let rel: string | undefined = "noopener";
    if ((href.startsWith("/") || href.startsWith("#")) && !href.endsWith(".pdf")) {
        // Open on same tab.
        target = "_self";
        rel = undefined;
    }

    return <a className={props.className} href={href} target={target} rel={rel}>{props.children}</a>;
}
