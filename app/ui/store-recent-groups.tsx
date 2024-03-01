"use client";

import { memo } from "react";

interface IPollGroupIdentity {
  pollGroupId: string;
  pollGroupName: string;
}

const StoreRecentGroups = memo(function StoreRecentGroups(props: IPollGroupIdentity) {
  const { pollGroupId, pollGroupName } = props;
  let recentGroups: IPollGroupIdentity[];
  try {
    recentGroups = JSON.parse(localStorage.getItem("pollGroups") ?? "");

    const filteredGroups = recentGroups.filter((group) => {
      return group.pollGroupId != pollGroupId;
    });

    if (filteredGroups.length == 5) {
      filteredGroups.pop();
    }

    filteredGroups.unshift({
      pollGroupId,
      pollGroupName,
    });

    localStorage.setItem("pollGroups", JSON.stringify(filteredGroups));
  } catch (error) {
    recentGroups = [{ pollGroupId, pollGroupName }];
    localStorage.setItem("pollGroups", JSON.stringify(recentGroups));
  }

  return null;
});

export default StoreRecentGroups;
