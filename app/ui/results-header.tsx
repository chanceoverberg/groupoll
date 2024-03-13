import { CreatedAt } from "./created-at";

interface IProps {
  title: string;
  created: Date | undefined;
  responseCount: number;
}

export function ResultsHeader(props: IProps) {
  const { title, created, responseCount } = props;
  return (
    <div>
      <h1 className="text-2xl">{title}</h1>
      <div className="text-md flex flex-row justify-between">
        <p>Total votes: {responseCount}</p>
        <CreatedAt date={created} />
      </div>
    </div>
  );
}
