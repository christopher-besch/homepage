import { sortTags } from "../tags.js";
import type { Talk } from "../talks.js";
import CardsList from "./cards_list.js";
import Layout from "./layout.js";
import TagsList from "./tags_list.js";
import Title from "./title.js";

interface TalksPageProps {
    route: string,
    talks: Talk[],
}
export default function TalksPage(props: TalksPageProps): React.ReactNode {
    const talksToShow = props.talks
        .filter(a => a.listed)
        // Date must be defined for all listed talks.
        .sort((a, b) => b.date!.getTime() - a.date!.getTime());
    const allTags = talksToShow.flatMap(p => p.tags);
    const tagsList = sortTags(allTags).slice(0, 5);
    return (
        <Layout
            route={props.route}
            title="Chris' Talks"
            styleSheets={["always.css", "default.css"]}>
            <TagsList tags={tagsList.map(([tag, _n]) => tag)} />
            <Title isHero={false} title="Talks" />
            <CardsList cards={talksToShow} />
        </Layout>
    );
}
