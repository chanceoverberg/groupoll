import Form from "@/app/ui/create-poll-form";
import Link from "next/link";

// TODO: pass info to server action. May need to bind it as seen here:
// https://nextjs.org/learn/dashboard-app/mutating-data#4-pass-the-id-to-the-server-action
export default function Page({ params }: { params: { id: string } }) {
  return (
    <main className="flex min-h-screen flex-col items-center text-center justify-center p-12">
      <div>
        <h1 className="text-2xl">Create a new poll for group: {params.id}</h1>
        <Form />
      </div>
      <Link href={`/${params.id}`} className="rounded-lg bg-violet-800 px-3 py-3 
          text-sm font-medium text-white hover:bg-violet-900 w-80">
          Back to group page
      </Link>
    </main>
  );
}
