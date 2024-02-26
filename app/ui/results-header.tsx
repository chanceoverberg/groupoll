interface IProps {
  title: string;
  created: string;
  responseCount: number;
}

export function ResultsHeader(props: IProps) {
  const { title, created, responseCount } = props;
  return (
    <div>
      <h1 className="text-2xl">{title}</h1>
      <div className="text-md flex flex-row justify-between">
        <p>Total votes: {responseCount}</p>
        <p className="w-3/5 text-right">Created at {created}</p>
      </div>
    </div>
  );
}
