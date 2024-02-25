import { getPoll, submitVote } from "../lib/actions";
import { OptionRow } from "./option-row";
import { Poll } from "@/types/models";
import Link from "next/link";
import { SubmitButton } from "./submit-button";
import BackToGroup from "./back-to-group";

interface IProps {
  pollGroupId: string;
  urlId: string;
}

export default async function Form(props: IProps) {
  const { pollGroupId, urlId } = props;
  const poll: Poll | undefined = await getPoll(pollGroupId, +urlId);

  const submiteVoteWithId = submitVote.bind(null, pollGroupId, +urlId);

  return (
    <form action={submiteVoteWithId}>
      <h1 className="text-2xl">{poll?.question}</h1>
      <div className="rounded-xl mb-4 border-solid border-2 border-violet-800 min-h-56 h-full overflow-y-auto">
        {poll?.options?.map((option, index) => {
          return <OptionRow key={index} option={option.option ?? ""} id={option.id} />;
        })}
      </div>
      <div className="flex flex-row justify-between relative">
        <BackToGroup pollGroupId={pollGroupId} />
        <div>
          <SubmitButton enabledMessage="Vote" disabledMessage="Submitting..." />
          <Link
            href={`/${pollGroupId}/${urlId}/results`}
            className="rounded-lg bg-violet-800 px-3 py-3 text-sm font-medium text-white hover:bg-violet-900 w-80"
          >
            Results
          </Link>
        </div>
      </div>
    </form>
  );
}
