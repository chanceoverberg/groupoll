import Form from "@/app/ui/vote-form";
import Link from "next/link";

export default async function Page({
  params,
}: {
  params: { pollGroupId: string; pollId: string };
}) {
  return (
    <main className="flex min-h-screen flex-col items-center text-center justify-center">
      <div className="w-full sm:w-4/5 xl:w-3/5 2xl:w-2/5 h-4/5 pl-3 pr-3">
        <Form pollGroupId={params.pollGroupId} urlId={params.pollId} />
      </div>
      <Link
        href={`/${params.pollGroupId}`}
        className="rounded-lg bg-violet-800 px-3 py-3 
          text-sm font-medium text-white hover:bg-violet-900 w-80"
      >
        Back to group page
      </Link>
    </main>
  );
}
