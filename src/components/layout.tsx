interface LayoutProps {
    title: string,
    description?: string,
    styleSheets?: string[],
}
export default function Layout(props: React.PropsWithChildren<LayoutProps>): React.ReactNode {
    const styleSheetLinks = props.styleSheets != undefined ? props.styleSheets.map((styleSheet, i) =>
        <link key={i} rel="stylesheet" type="text/css" href={`/styles/${styleSheet}`} />
    ) : undefined;
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
                {props.children}
            </body>
        </html>
    );
}
