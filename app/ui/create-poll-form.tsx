"use client";

import { Button } from "@/app/ui/button";
import { createPoll } from "../lib/actions";
import { useState } from "react";
import { SubmitButton } from "./submit-button";

interface IInputOptions {
  id: string;
  placeholder: string;
}

export default function Form({ pollGroupId }: { pollGroupId: string }) {
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
    const inputOptions: IInputOptions = {
      id: `option-${options.length + 1}`,
      placeholder: `Option ${options.length + 1}`,
    };
    setOptions([...options, inputOptions]);
  };

  const removeOption = () => {
    const length = options.length;
    setOptions(
      options.filter((option) => {
        return option.id != `option-${length}`;
      })
    );
  };

  const createPollWithId = createPoll.bind(null, pollGroupId);

  return (
    <form action={createPollWithId} className="flex flex-col text-left">
      <p className="pt-2">Title</p>
      <input
        id="poll"
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
      <p className="pt-2">Options</p>
      {options.map((option, i) => {
        return (
          <input
            key={i}
            id={option.id}
            name="option"
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
        );
      })}
      <div></div>
      <Button type="button" onClick={addOption}>
        Add Option
      </Button>
      <Button type="button" onClick={removeOption}>
        Remove Option
      </Button>
      <div></div>
      <SubmitButton enabledMessage="Create Poll" disabledMessage="Creating..." />
    </form>
  );
}
