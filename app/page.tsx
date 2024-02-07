import Form from "@/app/ui/create-group-form"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center text-center justify-center p-12">
      <div>
        <h1 className="text-2xl">Groupoll</h1>
        <h2 className="text-1xl">Create a group to start adding polls to it, then share the URL with others.</h2>
        <Form />
      </div>
    </main>
  );
}
