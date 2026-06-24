interface CiteProps {
    id: string;
    // citation id, list of cititation links
    citations: [string, string[]][];
}
export default async function Cite(props: CiteProps): Promise<React.ReactNode> {
    let idx = props.citations.findIndex(([id, _]) => id == props.id);
    if (idx == -1) {
        props.citations.push([props.id, []]);
        idx = props.citations.length - 1;
    }

    let [_, citationLinks] = props.citations[idx]!;
    let citation_html_id = `citation-${props.id}-${citationLinks.length}`;
    citationLinks.push(`#${citation_html_id}`);

    return (
        <sup id={citation_html_id}>
            <a href={`#reference-${props.id}`}>
                {/* Don't start counting at 0. */}
                [{idx + 1}]
            </a>
        </sup>
    );
}
