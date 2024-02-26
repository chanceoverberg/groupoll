interface IProps {
  option: string;
  id: string;
}

export function OptionRow(props: IProps) {
  const { option, id } = props;
  return (
    <div className="rounded-xl p-2 pb-6 mt-2 mb-2 ml-1 mr-1 border-solid border border-slate-700 min-h-16 flex flex-row">
      <input type="radio" name="option" value={id} required></input>
      <label htmlFor="option">{option}</label>
    </div>
  );
}
