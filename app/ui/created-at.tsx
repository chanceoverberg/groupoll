interface IProps {
  date: Date | undefined;
}

export function CreatedAt(props: IProps) {
  const { date } = props;
  const createdAt = date?.toLocaleTimeString() + " on " + date?.toDateString();

  if (date) {
    return <p className="w-3/5 text-right">Created at {createdAt}</p>;
  } else {
    return null;
  }
}
