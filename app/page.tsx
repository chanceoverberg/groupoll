import Form from "@/app/ui/create-group-form";

// TODO (FYI): consider adding a list of recent groups I have visited. Would probably have to store them in local storage
// TODO (ITF): add data validation here including character length

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center text-center justify-center">
      <div>
        <h1 className="text-2xl">Groupoll</h1>
        <h2 className="text-1xl">
          Create a group to start adding polls to it, then share the URL with others.
        </h2>
        <Form />
      </div>
    </main>
  );
}
