"use client";

import { Button } from "@/app/ui/button";
import { CreatePollState, createPoll } from "../lib/actions";
import { Fragment, useState } from "react";
import { SubmitButton } from "./submit-button";
import { useFormState } from "react-dom";

interface IInputOptions {
  id: string;
  placeholder: string;
}

export default function Form({ pollGroupId }: { pollGroupId: string }) {
  const initialState: CreatePollState = { message: null, errors: null };
  const createPollWithId = createPoll.bind(null, pollGroupId);
  const [state, dispatch] = useFormState(createPollWithId, initialState);

  const initialOptions: IInputOptions[] = [
    {
      id: "option-1",
      placeholder: "Option 1",
    },
    {
      id: "option-2",
      placeholder: "Option 2",
    },
  ];

  const [options, setOptions] = useState<IInputOptions[]>(initialOptions);

  const addOption = () => {
    const length = options.length;

    if (length >= 16) {
      return;
    }

    const inputOptions: IInputOptions = {
      id: `option-${length + 1}`,
      placeholder: `Option ${length + 1}`,
    };
    setOptions([...options, inputOptions]);
  };

  const removeOption = () => {
    const length = options.length;
    if (length == 2) {
      return;
    }
    setOptions(
      options.filter((option) => {
        return option.id != `option-${length}`;
      })
    );
  };

  return (
    <form action={dispatch} className="flex flex-col text-left">
      <p className="pt-2">Title</p>
      <input
        id="pollTitle"
        name="pollTitle"
        placeholder="Type your question here"
        className="text-white rounded-md border m-1
            border-slate-700
            py-2 pl-5 text-sm
            placeholder:text-gray-500
            focus-visible:outline 
            focus-visible:outline-2 
            focus-visible:outline-offset-2 
            focus-visible:outline-violet-700
            bg-violet-1000
            overflow-y-scroll
            "
      />
      <div id="poll-title-error" aria-live="polite" aria-atomic="true">
        {state?.errors &&
          state.errors.map(
            (error) =>
              error.path[0] == "pollTitle" && (
                <p className="text-sm text-red-500" key={error.message}>
                  {error.message}
                </p>
              )
          )}
      </div>
      <p className="pt-2">Options</p>
      {options.map((option, i) => {
        return (
          <Fragment key={i}>
            <input
              id={option.id}
              name="pollOption"
              placeholder={option.placeholder}
              className="text-white rounded-md border m-1
                        border-slate-700
                        py-2 pl-5 text-sm
                        placeholder:text-gray-500
                        focus-visible:outline 
                        focus-visible:outline-2 
                        focus-visible:outline-offset-2 
                        focus-visible:outline-violet-700
                        bg-violet-1000"
            />
            <div id={`poll-option-error-${i}`} aria-live="polite" aria-atomic="true">
              {state?.errors &&
                state.errors.map(
                  (error) =>
                    error.path[0] == "pollOptions" &&
                    error.path[1] == i && (
                      <p className="text-sm text-red-500" key={error.message}>
                        {error.message}
                      </p>
                    )
                )}
            </div>
          </Fragment>
        );
      })}
      <div id="missing-fields-error" aria-live="polite" aria-atomic="true">
        {state.message && !state.errors && (
          <p className="text-sm text-red-500" key={state.message}>
            {state.message}
          </p>
        )}
      </div>
      <div className="flex flex-row items-center">
        <Button type="button" onClick={addOption} className="w-2/5">
          Add Option
        </Button>
        <Button type="button" onClick={removeOption} className="w-2/5">
          Remove Option
        </Button>
        <SubmitButton
          enabledMessage="Create Poll"
          disabledMessage="Creating..."
          className="w-2/5"
        />
      </div>
    </form>
  );
}
