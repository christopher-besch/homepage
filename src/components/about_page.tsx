import { getArticleRoute, getResourceLoadPath, loadProjectsPath } from "../paths.js";
import Layout from "./layout.js";
import Link from "./link.js";
import Title from "./title.js";

interface AboutPageProps {
    route: string,
};
export default function AboutPage(props: AboutPageProps): React.ReactNode {
    const heroImage = {
        inputPath: getResourceLoadPath("about_hero.jpg"),
        // Setting this too low makes the image jump when switching between landscape and portrait.
        objectFitHorizontal: 65,
        objectFitVertical: 40,
        children: <Title isHero={true} title="About & Contact" />,
    };
    return <Layout
        route={props.route}
        title="About & Contact Chris"
        styleSheets={["always.css", "article.css"]}
        heroImage={heroImage}
    >
        <div className="markdown_body about_page">
            <p className="about_page_right"><em>Twenty seconds and counting.</em></p>
            <p className="about_page_left">
                Hi, welcome to my place on the web!
                This is where I post random personal projects and crave positive feedback.
                <br />
                Do so via
            </p>
            <ul className="about_page_left">
                <li><Link href="mailto:mail@chris-besch.com">mail@chris-besch.com</Link> (PGP: <Link href={"/pgp_pub_key.asc"}><em>9393&nbsp;2AD1&nbsp;1DCC&nbsp;2CCB&nbsp;4852&nbsp;AE70&nbsp;D610&nbsp;18FF&nbsp;A38E&nbsp;5AFA</em></Link>) or</li>
                <li>with hearts and stars on <Link href="https://codeberg.org/christopher-besch">codeberg.org/christopher-besch</Link> or</li>
                <li><Link href="https://github.com/christopher-besch">github.com/christopher-besch</Link>, thank you :)</li>
            </ul>
            <p className="about_page_left">
                <br />
                No seriously, do reach out if you have something cool to share or just to say 'hi'!
            </p>
            <p className="about_page_right"><em>T minus 15 seconds, guidance is internal.</em></p>
            <p className="about_page_left">
                I like bolting things together until they don't fall apart anymore.
                Whenever I can, I do so in groups — watching things go kaput is always more fun with company!
            </p>
            <p className="about_page_right"><em>12, 11, 10, 9, ignition sequence start...</em></p>
            <p className="about_page_left">
                What are the things I'm interested in?
                <br />
                Everything, kinda.
                Somehow it's very easy for me to find motivation for all sorts of things — just take a look at my <Link href={loadProjectsPath}>projects</Link> and you'll see where that got me.
                <br />
                That's fun and all but In the long run I'd like to work on:
            </p>
            <ul className="aobut_page_left">
                <li>autonomous</li>
                <li>embedded systems</li>
                <li>with real-time constraints</li>
                <li>in a high-risk environment.</li>
            </ul>
            <p className="about_page_left">
                You get that I like rockets, right?
            </p>
            <p className="about_page_right"><em>...6, 5, 4, 3...</em></p>
            <p className="about_page_left">
                {/* The space is required because the link on the next line fudges things up. */}
                What's more, I love working in public.&nbsp;
                <Link href={getArticleRoute("open_source")}>Open-Source is quite amazing</Link> — I try publishing as much as possible.
                I hope you can find some use for it.
            </p>
            <p className="about_page_right"><em>...2, 1, zero, all engine running...</em></p>
            <p className="about_page_left">
                Oh and I love the black abyss that is the Linux terminal.
                Whenever I feel down, things just fell apart or something else, it is always there for me and greets me with it's blinking cursor.
            </p>
            <p className="about_page_right"><em>LIFT-OFF! We have a lift-off, 32 minutes past the hour. Lift-off on Apollo 11.</em></p>
            <p className="about_page_left">
                Thank you and have a very safe and productive day.
                <br />
                <em>
                    Do you get the <Link href="https://combineoverwiki.net/wiki/Black_Mesa_Transit_System/Quotes#Half-Life">quote</Link>?
                </em>
            </p>
        </div>
    </Layout >;
}
