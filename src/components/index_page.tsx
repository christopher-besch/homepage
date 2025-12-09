import { getResourceLoadPath } from "../paths.js";
import Layout from "./layout.js";

interface IndexPageProps {
}
export default function IndexPage(_props: IndexPageProps): React.ReactNode {
    return (
        <Layout
            title="Chris' Homepage"
            styleSheets={["always.css", "default.css"]}
            heroImage={{
                inputPath: getResourceLoadPath("index_hero.jpg"),
                objectFitHorizontal: 65,
                objectFitVertical: 30,
                // heightFraction: 0.5,
                children: <div>Hello World</div>,
            }}>
            <div className="index_page_div">
                Hello World!<br />
                Hello World!<br />
                Hello World!<br />
                Hello World!<br />
                Hello World!<br />
                Hello World!<br />
                Hello World!<br />
                Hello World!<br />
                Hello World!<br />
                Hello World!<br />
                Hello World!<br />
                Hello World!
            </div>
        </Layout>
    );
}
