import { getPollResults } from "@/app/lib/actions";
import BackToGroup from "@/app/ui/back-to-group";
import { ResponseRow } from "@/app/ui/response-row";
import { ResultsHeader } from "@/app/ui/results-header";
import { PollResults } from "@/types/models";

/* TODO (FYI): I THINK this page (and probably all other pages) are being cached. Look into how/when
  to revalidate these. Not sure if can be done with revalidate path the way I want it to.
  I also want the results page to update live (or every few seconds) if possible. */

// TODO (FYI): handle undefined more gracefully

export default async function Page({
  params,
}: {
  params: { pollGroupId: string; pollId: string };
}) {
  const results: PollResults | undefined = await getPollResults(params.pollGroupId, +params.pollId);
  const createdAt =
    results?.createdAt?.toLocaleTimeString() + " on " + results?.createdAt?.toDateString();

  results?.optionResults?.sort((or1, or2) => {
    if (or1.responseCount != undefined && or2.responseCount != undefined) {
      return or2.responseCount - or1.responseCount;
    }
    return 0;
  });

  return (
    <main className="flex h-screen flex-col items-center text-center justify-center pt-6 pb-36">
      <div className="w-full sm:w-4/5 xl:w-3/5 2xl:w-2/5 max-h-full pl-3 pr-3">
        <ResultsHeader
          title={results?.question ?? ""}
          created={createdAt ?? ""}
          responseCount={results?.responseCount ?? 0}
        />
        <div className="rounded-xl mb-2 border-solid border-2 border-violet-800 min-h-56 h-full overflow-y-auto">
          {results?.optionResults?.map((result, key) => {
            return (
              <ResponseRow
                key={key}
                option={result.option ?? ""}
                responseCount={result.responseCount ?? 0}
              />
            );
          })}
        </div>
        <div className="flex flex-row">
          <BackToGroup pollGroupId={params.pollGroupId} />
        </div>
      </div>
    </main>
  );
}
