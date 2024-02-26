import BackToGroup from "@/app/ui/back-to-group";
import Form from "@/app/ui/vote-form";

export default async function Page({
  params,
}: {
  params: { pollGroupId: string; pollId: string };
}) {
  return (
    <main className="flex h-screen flex-col items-center text-center justify-center pt-12 pb-20">
      <div className="w-full sm:w-4/5 xl:w-3/5 2xl:w-2/5 max-h-full pl-3 pr-3">
        <Form pollGroupId={params.pollGroupId} urlId={params.pollId} />
      </div>
    </main>
  );
}
