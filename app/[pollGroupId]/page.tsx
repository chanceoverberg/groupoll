import Link from "next/link";
import { PollRow } from "../ui/poll-row";
import { getPollGroup, getPollsForGroup } from "../lib/actions";

export default async function Page({ params }: { params: { pollGroupId: string } }) {
  const data = await Promise.all([
    getPollGroup(params.pollGroupId),
    getPollsForGroup(params.pollGroupId),
  ]);

  return (
    <main className="flex h-screen flex-col items-center justify-center">
      <h1 className="text-2xl">{data[0]?.name}</h1>
      <div className="w-full sm:w-4/5 xl:w-3/5 2xl:w-2/5 max-h-4/5 pl-3 pr-3">
        <div
          className="rounded-xl mb-4 border-solid border-2 border-violet-800
                        min-h-56 h-full overflow-y-auto"
        >
          {data[1].map((poll, i) => {
            let responseCount = 0;
            poll.options?.map((option) => {
              responseCount += option.responses?.length ?? 0;
            });
            return (
              <PollRow
                key={i}
                pollGroupId={params.pollGroupId}
                urlId={poll.urlId}
                question={poll.question}
                created={poll.createdAt}
                responseCount={responseCount}
              />
            );
          })}
        </div>
        <Link
          href={`/${params.pollGroupId}/create`}
          className="rounded-lg bg-violet-800 px-3 py-3 
                    text-sm font-medium text-white hover:bg-violet-900 "
        >
          Add Poll
        </Link>
      </div>
    </main>
  );
}
