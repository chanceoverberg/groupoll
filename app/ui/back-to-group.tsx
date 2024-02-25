import Link from "next/link";

interface IProps {
  pollGroupId: string;
}

export default async function BackToGroup(props: IProps) {
  const { pollGroupId } = props;
  return (
    <Link
      href={`/${pollGroupId}`}
      className="rounded-lg bg-violet-800 px-3 py-3
        text-sm font-medium text-white hover:bg-violet-900 w-40"
    >
      Back to group page
    </Link>
  );
}
