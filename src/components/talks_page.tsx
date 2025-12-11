import type { Talk } from "../talks.js";
import CardsList from "./cards_list.js";
import Layout from "./layout.js";
import Title from "./title.js";

interface TalksPageProps {
    talks: Talk[],
}
export default function TalksPage(props: TalksPageProps): React.ReactNode {
    const talksToShow = props.talks
        .filter(a => a.listed)
        // Date must be defined for all listed talks.
        .sort((a, b) => b.date!.getTime() - a.date!.getTime());
    return (
        <Layout
            title="Chris' Talks"
            styleSheets={["always.css", "default.css"]}>
            <Title isHero={false} title="Talks" />
            <CardsList cards={talksToShow} />
        </Layout>
    );
}
