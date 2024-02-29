"use client";

import { useFormState } from "react-dom";
import { CreateGroupState, createGroup } from "../lib/actions";
import { SubmitButton } from "./submit-button";

export default function Form() {
  const initialState: CreateGroupState = { message: null, errors: {} };
  const [state, dispatch] = useFormState(createGroup, initialState);

  return (
    <form action={dispatch}>
      <input
        id="groupName"
        name="groupName"
        placeholder="Group Name"
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
      <SubmitButton enabledMessage="Create Group" disabledMessage="Creating..." />
      <div id="group-name-error" aria-live="polite" aria-atomic="true">
        {state.errors?.groupName &&
          state.errors.groupName.map((error: string) => (
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
    </form>
  );
}
