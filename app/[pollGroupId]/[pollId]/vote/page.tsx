import { getPoll } from "@/app/lib/actions";
import Form from "@/app/ui/vote-form";
import { Poll } from "@prisma/client";

export default async function Page({
  params,
}: {
  params: { pollGroupId: string; pollId: string };
}) {
  const poll: Poll | undefined = await getPoll(params.pollGroupId, +params.pollId);

  return (
    <main className="flex h-screen flex-col items-center text-center justify-center pt-12 pb-20">
      <div className="w-full sm:w-4/5 xl:w-3/5 2xl:w-2/5 max-h-full pl-3 pr-3">
        <Form poll={poll} />
      </div>
    </main>
  );
}
