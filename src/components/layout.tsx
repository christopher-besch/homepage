interface LayoutProps {
    title: string,
    description?: string,
    styleSheets?: string[],
}
export default function Layout(props: React.PropsWithChildren<LayoutProps>): React.ReactNode {
    if (props.styleSheets == undefined) {
        props.styleSheets = [];
    }
    props.styleSheets.push("reset.css");
    const styleSheetLinks = props.styleSheets.map((styleSheet, i) =>
        <link key={i} rel="stylesheet" type="text/css" href={`/styles/${styleSheet}`} />
    );
    return (
        <html>
            <head>
                <meta charSet="UTF-8" />
                <title>{props.title}</title>
                <meta name="viewport" content="width=device-width,initial-scale=1" />
                <meta name="description" content={props.description} />
                {styleSheetLinks}
                {/* <link rel="icon" href="favicon.png" /> */}
            </head>

            <body>
                <div id="layout_navbar">
                    <a id="layout_navbar_left" href="/">Christopher Besch</a>
                    <div className="layout_navbar_right">
                        <input id="layout_navbar_toggle" type="checkbox"></input>
                        <label htmlFor="layout_navbar_toggle" className="layout_navbar_hamburger">
                            <div></div>
                            <div></div>
                            <div></div>
                        </label>
                        <a href="/articles">Articles</a>
                        <a href="/photography">Photos</a>
                        <a href="/projects">Projects</a>
                        <a href="/talks">Talks</a>
                        <a href="/articles/bookmarks">Bookmarks</a>
                        <a href="/about">About</a>
                    </div>
                </div>
                {props.children}
            </body>
        </html>
    );
}
