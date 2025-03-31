import React from "react";
import { Link } from "gatsby";
import { getImage, GatsbyImage, IGatsbyImageData, ImageDataLike } from "gatsby-plugin-image";

import * as styles from "src/styles/tile_list.module.scss";

export type Tile = {
    id: number;
    date: string;
    description: string;
    link: string;
    title: string;
    thumb: IGatsbyImageData;
    is_internal: boolean;
}

export function gql_article_to_tile(article: any): Tile {
    return {
        id: article.node.id,
        date: article.node.frontmatter?.date,
        description: article.node.frontmatter?.description,
        link: `/articles/${article.node.frontmatter?.slug}`,
        title: article.node.frontmatter?.title,
        thumb: getImage(article.node.frontmatter?.thumb as ImageDataLike)!,
        is_internal: true,
    };
}

export function gql_talk_to_tile(talk: any): Tile {
    return {
        id: talk.node.id,
        date: talk.node.frontmatter?.date,
        description: talk.node.frontmatter?.description,
        link: talk.node.frontmatter?.link,
        title: talk.node.frontmatter?.title,
        thumb: getImage(talk.node.frontmatter?.thumb as ImageDataLike)!,
        is_internal: false,
    };
}

interface TileListProps {
    tiles: Tile[];
    className?: string;
}
const TileList = (props: TileListProps) => {
    return (
        <div className={props.className}>
            {props.tiles.map(tile => {
                const tile_content = <div className={styles.tile}>
                    <div className={styles.image}>
                        <GatsbyImage image={tile.thumb} alt="thumbnail" />
                    </div>
                    <div className={styles.body}>
                        <div>
                            <h2 className={styles.heading}>{tile.title}</h2>
                            <hr />
                            <div>
                                {tile.description.split("\n").map((paragraph, idx) =>
                                    <p key={idx}>{paragraph}</p>
                                )}
                            </div>
                        </div>

                        <p className={styles.date}>{tile.date}</p>
                    </div>
                </div>
                return tile.is_internal
                    ? <Link to={tile.link} key={tile.id} className={styles.link}>{tile_content}</Link>
                    : <a target="_blank" href={tile.link} key={tile.id} className={styles.link}>{tile_content}</a>;
            }
            )}
        </div>
    );
};
export default TileList;

