import Layout from "./layout.js";
import Markdown from "./markdown.js";

interface IndexProps {
}
export default function Index(_props: IndexProps): React.ReactNode {
    return (
        <Layout title="Chris' Homepage" styleSheets={["default.css"]}>
            <div className="index_div">
                Hello World!
                <Markdown path="./articles/test/test.md" />
            </div>
        </Layout>
    );
}
