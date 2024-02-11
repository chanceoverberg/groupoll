import Link from "next/link";
import { SurveyRow } from "../ui/survey-row";

import { surveyRows } from "@/app/lib/placeholder-data";

export default function Page({ params }: { params: { id: string } }) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-12">
        <h1 className="text-2xl">Main page for group: {params.id}</h1>
        <div className="w-3/5 max-h-full">
            <div className="rounded-xl mb-4 border-solid border-2 border-violet-800
                    min-h-56 max-h-96 overflow-y-auto">
                {surveyRows.map((survey, i) => {
                    return (<SurveyRow key={i} groupId={params.id} id={survey.id} title={survey.title} 
                        created={survey.created} responseCount={survey.responseCount}/>);
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