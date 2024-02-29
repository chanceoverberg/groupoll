"use client";

import { SubmitVoteState, submitVote } from "../lib/actions";
import { OptionRow } from "./option-row";
import { Poll } from "@/types/models";
import Link from "next/link";
import { SubmitButton } from "./submit-button";
import { useFormState } from "react-dom";

interface IProps {
  poll: Poll | undefined;
}

export default function Form(props: IProps) {
  const { poll } = props;
  const initialState: SubmitVoteState = { message: "", errors: {} };
  const submiteVoteWithId = submitVote.bind(null, poll?.pollGroupId ?? "", poll);
  const [state, dispatch] = useFormState(submiteVoteWithId, initialState);

  return (
    <form action={dispatch} className="h-full pb-8">
      <h1 className="text-2xl">{poll?.question}</h1>
      <div className="rounded-xl mb-4 border-solid border-2 border-violet-800 h-full overflow-y-auto">
        {poll?.options?.map((option, index) => {
          return <OptionRow key={index} option={option.option ?? ""} id={option.id} />;
        })}
      </div>
      <div id="vote-option-error" aria-live="polite" aria-atomic="true">
        {state.errors.voteOption &&
          state.errors.voteOption.map((error: string) => (
            <p className="text-sm text-red-500" key={error}>
              {error}
            </p>
          ))}
      </div>
      <div id="missing-fields-error" aria-live="polite" aria-atomic="true">
        {state.message && !state.errors && (
          <p className="text-sm text-red-500" key={state.message}>
            {state.message}
          </p>
        )}
      </div>
      <div className="flex flex-row justify-between relative">
        <Link
          href={`/${poll?.pollGroupId}`}
          className="rounded-lg bg-violet-800 px-3 py-3
        text-sm font-medium text-white hover:bg-violet-900 w-40"
        >
          Back to group page
        </Link>
        <div>
          <SubmitButton enabledMessage="Vote" disabledMessage="Submitting..." />
          <Link
            href={`/${poll?.pollGroupId}/${poll?.urlId}/results`}
            className="rounded-lg bg-violet-800 px-3 py-3 text-sm font-medium text-white hover:bg-violet-900 w-80"
          >
            Results
          </Link>
        </div>
      </div>
    </form>
  );
}
