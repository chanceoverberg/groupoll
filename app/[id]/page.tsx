import Link from "next/link";
import { SurveyRow } from "../ui/survey-row";
import { surveyRows } from "@/app/lib/placeholder-data";
import { getPollsForGroup } from "../lib/actions";
import { Poll } from "@/types/models";

export default async function Page({ params }: { params: { id: string } }) {
    const polls: Poll[] = await getPollsForGroup(params.id);
    let responseCount = 0;
    polls.map((poll) => {
        poll.options?.map((option) => {
            responseCount += option.responses?.length ?? 0;
        })
    })
    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-12">
            <h1 className="text-2xl">Main page for group: {params.id}</h1>
            <div className="w-3/5 max-h-full">
                <div className="rounded-xl mb-4 border-solid border-2 border-violet-800
                        min-h-56 max-h-96 overflow-y-auto">
                    {polls.map((poll, i) => {
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