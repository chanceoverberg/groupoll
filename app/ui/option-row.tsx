"use client";

interface IProps {
  option: string;
  id: string;
}

export function OptionRow(props: IProps) {
  const { option, id } = props;
  return (
    <div className="rounded-xl ml-1 mr-1 flex flex-row">
      <label className="w-full">
        <input type="radio" value={id} className="peer hidden" name="voteOption"></input>
        <div
          className="hover:bg-violet-900 hover:border-violet-900 flex items-center justify-between mt-1 mb-1 px-4 py-2 border-2 rounded-lg 
        cursor-pointer text-sm border-slate-700 group peer-checked:border-violet-500"
        >
          <h2 className="text-white">{option}</h2>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-9 h-9 text-violet-400 invisible group-[.peer:checked+&]:visible"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
      </label>
    </div>
  );
}
