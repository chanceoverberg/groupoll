import BackToGroup from "@/app/ui/back-to-group";
import Form from "@/app/ui/register-webhook";
import Link from "next/link";

export default function Home({ params }: { params: { pollGroupId: string } }) {
  return (
    <main className="flex min-h-full flex-col items-center justify-center">
      <div className="sm:w-3/5">
        <h1 className="text-2xl pb-1">Add a Discord bot using a webhook</h1>
        <ol className="list-decimal pl-6 pb-2">
          <li>
            Open your <b>Server Settings</b> and head into the <b>Integrations</b> tab.
          </li>
          <li>
            Click the <b>Create Webhook</b> button to create a new webhook!
          </li>
          <li>
            Paste the webhook below and click <b>Register webhook</b>. See{" "}
            <Link
              href="https://support.discord.com/hc/en-us/articles/228383668-Intro-to-Webhooks"
              className="text-violet-500 transition-colors hover:text-violet-800"
              target="_blank"
            >
              this
            </Link>{" "}
            Discord support article for more information about webhooks.
          </li>
        </ol>
        <p className="pb-2">
          Once your webhook is registered, whenever a new poll is created, a notification with a
          link to the poll will be sent to that channel. If you ever get tired of the notifications,
          just delete the webhook using the Discord app.
        </p>
        <Form pollGroupId={params.pollGroupId} />
        <div className="flex flex-row justify-center">
          <BackToGroup pollGroupId={params.pollGroupId} />
        </div>
      </div>
    </main>
  );
}
