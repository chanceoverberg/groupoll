"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface IPollGroupIdentity {
  pollGroupId: string;
  pollGroupName: string;
}

export function RecentGroups() {
  const [recentGroups, setRecentGroups] = useState<IPollGroupIdentity[]>([
    { pollGroupId: "", pollGroupName: "" },
  ]);

  useEffect(() => {
    try {
      setRecentGroups(JSON.parse(localStorage.getItem("pollGroups") ?? ""));
    } catch (error) {
      // Continue
    }
  }, []);

  return (
    <>
      <h1 className="pb-1">Recent Groups</h1>
      <div className="flex flex-col justify-center rounded-xl border-solid border-2 border-violet-800 overflow-y-auto pl-2 pr-2">
        {recentGroups.map((group, key) => {
          return (
            <Link
              key={key}
              href={`/${group.pollGroupId}`}
              className="flex items-center text-sm text-white hover:text-violet-800 md:text-base pt-1 pb-1"
            >
              {group.pollGroupName}
            </Link>
          );
        })}
      </div>
    </>
  );
}
