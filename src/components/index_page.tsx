import Layout from "./layout.js";

interface IndexPageProps {
}
export default function IndexPage(_props: IndexPageProps): React.ReactNode {
    return (
        <Layout
            title="Chris' Homepage"
            styleSheets={["always.css", "default.css"]}
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
            </div>
        </Layout>
    );
}
