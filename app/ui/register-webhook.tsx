import { registerWebhook } from "../lib/actions";
import { SubmitButton } from "./submit-button";

export default function Form({ pollGroupId }: { pollGroupId: string }) {
  const registerWebhookWithId = registerWebhook.bind(null, pollGroupId);

  return (
    <form action={registerWebhookWithId} className="pb-2 flex flex-wrap justify-center">
      <input
        id="webhook"
        name="webhook"
        placeholder="Webhook URL"
        className="text-white rounded-md border m-1
            border-slate-700
            py-2 pl-5 text-sm
            placeholder:text-gray-500
            focus-visible:outline 
            focus-visible:outline-2 
            focus-visible:outline-offset-2 
            focus-visible:outline-violet-700
            bg-violet-1000 w-96"
      />
      <SubmitButton enabledMessage="Register webhook" disabledMessage="Registering..." />
    </form>
  );
}
