interface IProps {
  date: Date | undefined;
}

export function PollCreatedTime(props: IProps) {
  const { date } = props;
  const createdAt = date?.toLocaleTimeString() + " - " + date?.toDateString();

  if (date) {
    return <p className="text-sm text-gray-400 absolute bottom-2 left-7">{createdAt}</p>;
  } else {
    return null;
  }
}
