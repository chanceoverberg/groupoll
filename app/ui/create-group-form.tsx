import { createGroup } from "../lib/actions";
import { Button } from "@/app/ui/button"

export default function Form() {
    return (
        <form action={createGroup}>
            <input 
                id="group" 
                name="groupName" 
                placeholder="Group Name" 
                className="text-white rounded-md border m-1
                border-slate-700
                py-2 pl-5 text-sm
                placeholder:text-gray-500
                focus-visible:outline 
                focus-visible:outline-2 
                focus-visible:outline-offset-2 
                focus-visible:outline-violet-700
                bg-violet-1000"
            />
            <Button type="submit">Create Group</Button>
        </form>
    );
}