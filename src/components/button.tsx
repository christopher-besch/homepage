import Link from "./link.js";

interface ButtonProps {
    text: string,
    href?: string,
    onClick?: string,
};
export default function Button(props: ButtonProps): React.ReactNode {
    if ((props.href == undefined) == (props.onClick == undefined)) {
        throw new Error("Provide href or onClick, not both.");
    }
    if (props.href != undefined) {
        return <div><Link className="button" {...props} /></div>;
    } else {
        if (props.text.indexOf('<') > -1 || props.onClick!.indexOf('"') > -1) {
            throw new Error;
        }
        // We do this dangerouslySetInnerHTML because setting onClick in react requires hydration and we don't want that.
        // Setting a javascript pseudo protocol url also doesn't work because react sanitizes it.
        // This hack is our solution.
        return <div dangerouslySetInnerHTML={{ __html: `<button type="button" class="button" onclick="${props.onClick!}">${props.text}</button>` }} />;
    }
}
