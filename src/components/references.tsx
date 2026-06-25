import { Cite } from "@citation-js/core";
import "@citation-js/plugin-bibtex";
import * as fs from "fs";
import { Fragment } from "react";

import Link from "./link.js";

export type BibEntry = {
    id: string;
    type?: string;
    title?: string;
    author?: Array<{
        given?: string;
        family?: string;
        literal?: string;
    }>;
    issued?: {
        "date-parts"?: number[][];
    };
    URL?: string;
    DOI?: string;
    publisher?: string;
    "container-title"?: string;
    note?: string;
};

interface ReferencesProps {
    bibliographyPath: string;
    // citation id, list of cititation links
    citations: [string, string[]][];
}
export default async function References(props: ReferencesProps): Promise<React.ReactNode> {
    const file = await fs.promises.readFile(props.bibliographyPath, "utf8");
    const bibliography = Cite(file).data as BibEntry[];
    return (
        <div className="references">
            <h1>References</h1>
            <ol>
                {props.citations.map(([id, citationLinks]) => {
                    const bib_entry = bibliography.find((entry) => entry.id == id);
                    if (bib_entry == undefined) {
                        throw new Error(`${id} reference not in bibliography`);
                    }

                    // similar to Wikipedia
                    let citationLinksNode: React.ReactNode;
                    if (citationLinks.length == 1) {
                        citationLinksNode = <>
                            <a href={citationLinks[0]}>^</a>
                            {" "}
                        </>;
                    } else {
                        citationLinksNode = <>
                            ^ {citationLinks.map((link, i) => <Fragment key={link}>
                                <a href={link}><sup><i>{i}</i></sup></a>
                                {" "}
                            </Fragment>)}
                        </>;
                    }

                    const formattedAuthors = bib_entry.author?.map(author =>
                        (author.given == undefined ? "" : author.given + " ") +
                        (author.family == undefined ? "" : author.family)
                    ).join(", ");

                    return <li id={`reference-${id}`} key={id}>
                        {citationLinksNode}
                        {bib_entry.URL != undefined ?
                            <Link href={bib_entry.URL}>{bib_entry.title}</Link>
                            : bib_entry.title}
                        {". "}
                        <i>{formattedAuthors}</i>
                        {". "}
                        {bib_entry.note}
                    </li>;
                })}
            </ol>
        </div>
    );
}
