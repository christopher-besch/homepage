import { formatDateShort } from "../date.js";
import Image from "./image.js";
import Link from "./link.js";
import { Fragment } from "react";

export interface CardListable {
    listed: boolean,
    title: string,
    description: string,
    // required when listed
    date?: Date,
    // required when listed
    banner?: string,
    tags: string[],
    // This is the route when it's an article on this website.
    link: string,
    readingTimeMinutes?: number,
};

interface CardsListProps {
    cards: CardListable[],
}
export default function CardsList(props: CardsListProps): React.ReactNode {
    if (props.cards.filter(c => !c.listed).length) {
        throw new Error("Created a list of unlisted cards.");
    }
    return (
        <div className="cards_list">
            {props.cards.map((card, i) =>
                <Link key={i} className="cards_list_card" href={card.link}>
                    <Image inputPath={card.banner!} lazy={true} />
                    {/* Make all underscores breakable. */}
                    <h1>{card.title.split("_").map((s, i) => <Fragment key={i}>{i == 0 ? s : <Fragment>{`_${s}`}<wbr /></Fragment>}</Fragment>)}</h1>
                    {card.date != undefined ?
                        <h2>
                            {formatDateShort(card.date)}
                            <span>{card.readingTimeMinutes == undefined ? undefined : ` ${Math.round(card.readingTimeMinutes)}min`}</span>
                        </h2> : undefined}
                    <hr />
                    <p>{card.description}</p>
                </Link>
            )}
        </div>
    );
}
