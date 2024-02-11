import { ResponseRow } from "@/app/ui/response-row";
import { ResultsHeader } from "@/app/ui/results-header";
import Link from "next/link";

export default function Page({ params }: { params: { id: string } }) {
    return (
      <main className="flex min-h-screen flex-col items-center text-center justify-center p-12">
        <div className="w-3/5 max-h-full">
          <ResultsHeader title="What is your favorite color?" created="Jan 1, 2024" responseCount="20"/>
          <div className="rounded-xl mb-4 border-solid border-2 border-violet-800 min-h-56 max-h-96 overflow-y-auto">
            <ResponseRow id="1" option="Blue" responseCount="12"/>
            <ResponseRow id="2" option="Red" responseCount="0"/>
            <ResponseRow id="3" option="Purple" responseCount="3"/>
            <ResponseRow id="4" option="Orange" responseCount="5"/>
          </div>
        </div>
        <Link href={`/${params.id}`} className="rounded-lg bg-violet-800 px-3 py-3 
          text-sm font-medium text-white hover:bg-violet-900 w-80">
          Back to group page
        </Link>
      </main>
    );
  }
  