import Layout from "./layout.js";
import Title from "./title.js";

interface PageNotFoundPageProps {
};
export default function PageNotFoundPage(_props: PageNotFoundPageProps): React.ReactNode {
    return <Layout
        title="404 Page Not Found"
        styleSheets={["always.css", "article.css"]}>
        <Title isHero={false} title="404 Page Not Found" />
        <div className="markdown_body">
            This page is not the page you are looking for.
            If you followed a link, that link is broken.
            Please send me a mail at <a href="mailto:mail@chris-besch.com">mail@chris-besch.com</a> and tell me where the broken link is.
            In any case you can always get back <a href="/">Home</a>.
        </div>
    </Layout>;
}
