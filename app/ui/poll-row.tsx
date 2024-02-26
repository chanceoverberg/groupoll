import { CalendarDaysIcon } from "@heroicons/react/24/outline";
import { ChartBarIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

interface IProps {
  pollGroupId: string;
  urlId: number;
  question: string;
  created: Date;
  responseCount: number;
}

export function PollRow(props: IProps) {
  const { pollGroupId, urlId, question, created, responseCount } = props;
  const creationTime = created?.toLocaleTimeString() + " - " + created?.toDateString();
  return (
    <Link href={`/${pollGroupId}/${urlId}/vote`}>
      <div
        className="rounded-xl p-2 pb-6 mt-2 mb-2 ml-1 mr-1 border-solid border border-slate-700
                min-h-16 flex flex-row justify-between hover:bg-violet-950 hover:border-violet-950 relative"
      >
        <div>
          <p>{question}</p>
          <CalendarDaysIcon className="h-5 w-5 absolute bottom-2 left-1" />
          <p className="text-sm text-gray-400 absolute bottom-2 left-7">{creationTime}</p>
        </div>
        <div className="flex flex-row">
          <p className="pr-1 absolute bottom-1 right-6">{responseCount}</p>
          <ChartBarIcon className="h-5 w-5 absolute bottom-2 right-1" />
        </div>
      </div>
    </Link>
  );
}
