import Layout from "./layout.js";
import Markdown from "./markdown.js";

interface IndexProps {
}
export default function Index(_props: IndexProps): React.ReactNode {
    return (
        <Layout
            title="Chris' Homepage"
            styleSheets={["default.css"]}
            heroImage={{
                loadPath: "/home/chris/IMG_0026.jpg",
                objectFitHorizontal: 65,
                objectFitVertical: 30,
                // heightFraction: 0.5,
                children: <div>Hello World</div>,
            }}>
            <div className="index_div">
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
                <Markdown path="./articles/test/test.md" />
            </div>
        </Layout>
    );
}
