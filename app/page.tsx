import Form from "@/app/ui/create-group-form";
import { RecentGroups } from "./ui/recent-groups";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center text-center justify-center">
      <div className="pt-44 pb-20">
        <h1 className="text-2xl">Groupoll</h1>
        <h2 className="text-1xl">
          Create a group to start adding polls to it, then share the URL with others.
        </h2>
        <Form />
      </div>
      <RecentGroups />
    </main>
  );
}
