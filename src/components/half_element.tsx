interface HalfElementProps {
    children: React.ReactNode;
    // should spread entire width?
    full?: boolean;
}
// Used in mdx for a side element.
export default function HalfElement(props: HalfElementProps): React.ReactNode {
    return (
        <div className={props.full ? undefined : "half_element_wrapper"}>
            {props.full ? undefined : <div className={"half_element_before"}></div>}
            <div className={props.full ? "half_element_full_element" : "half_element_element"}>
                {props.children}
            </div>
            {props.full ? <div className={"half_element_spacer"}></div> : <div className={"half_element_after"}></div>}
        </div>
    );
}
