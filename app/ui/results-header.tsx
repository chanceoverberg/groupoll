interface IProps {
    title: string,
    created: string,
    responseCount: string
}

export function ResultsHeader(props: IProps) {
    const { title, created, responseCount } = props;
    return (
        <div>
            <h1 className="text-2xl">{title}</h1>
            <div className="text-left text-md flex flex-row justify-between">
                <p>Total votes: {responseCount}</p>
                <p>Created on {created}</p>
            </div>
        </div>
    );
}