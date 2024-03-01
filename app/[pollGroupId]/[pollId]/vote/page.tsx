import { getHasVoted, getPoll } from "@/app/lib/actions";
import Form from "@/app/ui/vote-form";
import { Poll } from "@prisma/client";
import ip from "ip";

export default async function Page({
  params,
}: {
  params: { pollGroupId: string; pollId: string };
}) {
  const poll: Poll | undefined = await getPoll(params.pollGroupId, +params.pollId);
  const ipAddress = ip.address();
  const hasVoted = await getHasVoted(params.pollId, ipAddress);

  console.log("ip address: " + ipAddress);
  console.log("hasVoted: " + hasVoted);

  return (
    <main className="flex h-screen flex-col items-center text-center justify-center pt-12 pb-20">
      <div className="w-full sm:w-4/5 xl:w-3/5 2xl:w-2/5 max-h-full pl-3 pr-3">
        <Form poll={poll} />
      </div>
    </main>
  );
}
