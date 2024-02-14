interface IProps {
    option: string,
    responseCount: number
}

export function ResponseRow(props: IProps) {
    const { option, responseCount } = props;
    return (
        <div className="rounded-xl p-2 pb-6 mt-2 mb-2 ml-1 mr-1 border-solid border border-slate-700 min-h-16 flex flex-row justify-between relative">
            <p>{option}</p>
            <p>{responseCount} votes</p>
        </div>
    );
}