"use client";

import { useFormState } from "react-dom";
import { RegisterWebhookState, registerWebhook } from "../lib/actions";
import { SubmitButton } from "./submit-button";

export default function Form({ pollGroupId }: { pollGroupId: string }) {
  const initialState: RegisterWebhookState = { message: null, errors: {} };
  const registerWebhookWithId = registerWebhook.bind(null, pollGroupId);
  const [state, dispatch] = useFormState(registerWebhookWithId, initialState);

  return (
    <>
      <form action={dispatch} className="pb-2 flex flex-wrap justify-center">
        <input
          id="webhook"
          name="webhook"
          placeholder="Webhook URL"
          className="text-white rounded-md border m-1
            border-slate-700
            py-2 pl-5 text-base
            placeholder:text-gray-500
            focus-visible:outline 
            focus-visible:outline-2 
            focus-visible:outline-offset-2 
            focus-visible:outline-violet-700
            bg-violet-1000 w-96"
        />
        <SubmitButton enabledMessage="Register webhook" disabledMessage="Registering..." />
      </form>
      <div id="webhook-error" aria-live="polite" aria-atomic="true" className="text-center">
        {state.errors?.webhook && (
          <p className="text-sm text-red-500 pb-1" key={state.errors.webhook[0]}>
            {state.errors.webhook[0]}
          </p>
        )}
      </div>
      <div id="missing-fields-error" aria-live="polite" aria-atomic="true" className="text-center">
        {state.message && !state.errors && (
          <p className="text-sm text-red-500 pb-1" key={state.message}>
            {state.message}
          </p>
        )}
      </div>
    </>
  );
}
