import { getPollResults } from "@/app/lib/actions";
import { ResponseRow } from "@/app/ui/response-row";
import { ResultsHeader } from "@/app/ui/results-header";
import { PollResults } from "@/types/models";
import Link from "next/link";

/* TODO: I THINK this page (and probably all other pages) are being cached. Look into how/when
  to revalidate these. Not sure if can be done with revalidate path the way I want it to.
  I also want the results page to update live (or every few seconds) if possible. */

  // TODO: handle undefined more gracefully

export default async function Page({ params }: { params: { id: string, surveyId: string } }) {
  const results: PollResults | undefined = await getPollResults(params.id, +params.surveyId);
  const createdAt = results?.createdAt?.toDateString();
  return (
    <main className="flex min-h-screen flex-col items-center text-center justify-center">
      <div className="w-full sm:w-4/5 xl:w-3/5 2xl:w-2/5 h-4/5 pl-3 pr-3">
        <ResultsHeader title={results?.question ?? ""} created={createdAt ?? ""} responseCount={results?.responseCount ?? 0}/>
        <div className="rounded-xl mb-4 border-solid border-2 border-violet-800 min-h-56 h-full overflow-y-auto">
          {results?.optionResults?.map((result, key) => {
            return (
              <ResponseRow key={key} option={result.option ?? ""} responseCount={result.responseCount ?? 0}/>
            );
          })}
        </div>
      </div>
      <Link href={`/${params.id}`} className="rounded-lg bg-violet-800 px-3 py-3 
        text-sm font-medium text-white hover:bg-violet-900 w-80">
        Back to group page
      </Link>
    </main>
  );
}
  