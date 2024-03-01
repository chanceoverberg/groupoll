import Link from "next/link";
import { PollRow } from "../ui/poll-row";
import { getPollGroup, getPollsForGroup } from "../lib/actions";
import { notFound } from "next/navigation";
import StoreRecentGroups from "../ui/store-recent-groups";

// TODO (u/o): add incremental loading for polls via scrolling or pagination
// TODO (u/o): Wrap components that fetch data in Suspense. Can just use a loading spinner for now
// TODO (ITF): revalidate when possible to update the vote count

export default async function Page({ params }: { params: { pollGroupId: string } }) {
  const pollGroup = await getPollGroup(params.pollGroupId);
  if (!pollGroup) {
    notFound();
  }

  const polls = await getPollsForGroup(params.pollGroupId);

  let totalVotes = 0;
  polls.map((poll) => {
    poll.options.map((option) => {
      totalVotes += option.responses.length;
    });
  });

  return (
    <main className="flex h-screen flex-col items-center justify-center pt-12 pb-28">
      <h1 className="text-2xl text-wrap">{pollGroup.name}</h1>
      <div className="w-full sm:w-4/5 xl:w-3/5 2xl:w-2/5 max-h-full pl-3 pr-3">
        <div>
          <div className="text-left text-md flex flex-row justify-between">
            <p>Poll count: {polls.length}</p>
            <p>Total votes: {totalVotes}</p>
          </div>
        </div>
        <div className="rounded-xl mb-4 border-solid border-2 border-violet-800 min-h-56 h-full overflow-y-auto">
          {polls.map((poll, i) => {
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
        <div className="flex flex-row justify-between">
          <Link
            href={`/${params.pollGroupId}/create`}
            className="rounded-lg bg-violet-800 px-3 py-3 
                    text-sm font-medium text-white hover:bg-violet-900"
          >
            Add Poll
          </Link>
          <Link
            href={`/${params.pollGroupId}/register-webhook`}
            className="rounded-lg bg-violet-800 px-3 py-3 
                    text-sm font-medium text-white hover:bg-violet-900 "
          >
            Add Discord bot
          </Link>
        </div>
      </div>
      <StoreRecentGroups pollGroupId={params.pollGroupId} pollGroupName={pollGroup.name} />
    </main>
  );
}
