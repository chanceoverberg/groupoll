import { getPoll, submitVote } from "../lib/actions";
import { Button } from "@/app/ui/button"
import { OptionRow } from "./option-row";
import { Poll } from "@/types/models";
import Link from "next/link";

interface IProps {
    surveyGroupUrlId: string, 
    urlId: string
}

export default async function Form(props: IProps) {
    const { surveyGroupUrlId, urlId } = props;
    const poll: Poll | undefined = await getPoll(surveyGroupUrlId, +urlId);

    const submiteVoteWithId = submitVote.bind(null, surveyGroupUrlId, +urlId);

    return (
        <form action={submiteVoteWithId}>
                <h1 className="text-2xl">{poll?.question}</h1>
                <div className="rounded-xl mb-4 border-solid border-2 border-violet-800 min-h-56 max-h-96 overflow-y-auto">
                    {poll?.options?.map((option, index) => {
                    return (
                        <OptionRow key={index} option={option.option ?? ""} index={index.toString()} />
                    );
                    })}
                </div>
            <Button>Vote</Button>
            <Link href={`/${surveyGroupUrlId}/${urlId}/results`} className="rounded-lg bg-violet-800 px-3 py-3 text-sm font-medium text-white hover:bg-violet-900 w-80">
                Results
            </Link>
        </form>
    );
}