import BackToGroup from "@/app/ui/back-to-group";
import Form from "@/app/ui/create-poll-form";

// Reference for passing info to server action using binding:
// https://nextjs.org/learn/dashboard-app/mutating-data#4-pass-the-id-to-the-server-action
export default function Page({ params }: { params: { pollGroupId: string } }) {
  return (
    <main className="flex min-h-full flex-col items-center text-center justify-center">
      <div className="w-full md:w-3/5 lg:w-2/5">
        <h1 className="text-2xl">Create a new poll</h1>
        <Form pollGroupId={params.pollGroupId} />
      </div>
      <BackToGroup pollGroupId={params.pollGroupId} />
    </main>
  );
}
