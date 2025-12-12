interface QuoteProps {
    text: string;
    author: string;
};
export default function Quote(props: QuoteProps): React.ReactNode {
    return (
        <blockquote>
            <center>
                <em>"{props.text}"</em>  —{props.author}
            </center>
        </blockquote>
    );
}
