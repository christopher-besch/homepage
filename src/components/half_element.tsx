interface HalfElementProps {
    children: React.ReactNode;
    id?: string;
    num?: number;
    caption?: string;
    elements: string[];
    // should spread entire width?
    full?: boolean;
}
// Used in mdx for a side element.
export default function HalfElement(props: HalfElementProps): React.ReactNode {
    let fullCaption: string | undefined = undefined;
    if (props.id != undefined) {
        const type = props.id?.split(":")[0]!;
        const number = props.elements.filter(e => e.split(":")[0] == type).length + 1;
        if (props.elements.findIndex(e => e == props.id) != -1) {
            throw new Error(`${props.id} was used more than once.`);
        }
        // We do this assert because we would have prefered having a Ref component like in LaTeX.
        // Unlike the citations, however, the element references might appear before the element they refer to.
        // Therefore, we can't deduce the element's number without a second pass, which LaTeX does.
        // Asserting is the best we can do, instead.
        if (number != props.num) {
            throw new Error(`${props.id} was expected to be number ${props.num} but is ${number}.`);
        }
        props.elements.push(props.id);
        const typeName = {
            "fig": "Figure",
            "vid": "Video",
        }[type];
        if (typeName == undefined) {
            throw new Error(`${props.id} is an id for a type of element that doesn't exist.`);
        }
        if (props.caption == undefined) {
            throw new Error(`${props.id} doesn't have a caption.`);
        }
        fullCaption = `${typeName} ${number}: ${props.caption}`;
    }
    return (
        <div id={props.id} className={props.full ? undefined : "half_element_wrapper"}>
            {props.full ? undefined : <div className={"half_element_before"}></div>}
            <div className={props.full ? "half_element_full_element" : "half_element_element"}>
                {props.children}
                {fullCaption == undefined ? undefined :
                    <div className="half_element_caption" dangerouslySetInnerHTML={{ __html: fullCaption}} />
                }
            </div>
            {props.full ? <div className={"half_element_spacer"}></div> : <div className={"half_element_after"}></div>}
        </div>
    );
}
