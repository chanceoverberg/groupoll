interface IProps {
    option: string,
    index: string
}

export function OptionRow(props: IProps) {
    const { option, index } = props;
    return (
        <div className="rounded-xl p-2 pb-6 mt-2 mb-2 ml-1 mr-1 border-solid border border-slate-700 min-h-16 flex flex-row">
            <input type="radio" id={index} name="option" value={option}></input>
            <label htmlFor={index}>{option}</label>
        </div>
    );
}