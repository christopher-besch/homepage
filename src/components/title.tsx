interface TitleProps {
    isHero: boolean,
    title: string,
    subtitle?: string,
}
export default function Title(props: TitleProps): React.ReactNode {
    return <div className={props.isHero ? "title_in_hero" : "title_in_text"} >
        <h1>{props.title}</h1>
        <hr />
        {props.subtitle != undefined ? <h2>{props.subtitle}</h2> : undefined}
    </div>;
}
