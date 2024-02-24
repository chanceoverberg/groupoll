import Link from "next/link";
import { SurveyRow } from "../ui/survey-row";
import { getPollsForGroup } from "../lib/actions";
import { Poll } from "@/types/models";

// TODO: add back to group button in layout so it applies to all children
// Change group id to group name for showing the current group

export default async function Page({ params }: { params: { id: string } }) {
    const polls: Poll[] = await getPollsForGroup(params.id);

    return (
        <main className="flex h-screen flex-col items-center justify-center">
            <h1 className="text-2xl">Main page for group: {params.id}</h1>
            <div className="w-full sm:w-4/5 xl:w-3/5 2xl:w-2/5 h-4/5 pl-3 pr-3">
                <div className="rounded-xl mb-4 border-solid border-2 border-violet-800
                        min-h-56 h-full overflow-y-auto">
                    {polls.map((poll, i) => {
                        let responseCount = 0;
                        poll.options?.map((option) => {
                            responseCount += option.responses?.length ?? 0;
                        })
                        return (<SurveyRow key={i} surveyGroupUrlId={params.id} urlId={poll.urlId} 
                            question={poll.question} created={poll.createdAt} responseCount={responseCount}/>);
                    })}
                </div>
                <Link href={`/${params.id}/create`} className="rounded-lg bg-violet-800 px-3 py-3 
                    text-sm font-medium text-white hover:bg-violet-900 ">
                    Add Poll
                </Link>
            </div>
        </main>
    );
}