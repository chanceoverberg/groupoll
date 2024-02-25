"use server";

import { redirect } from "next/navigation";
import prisma from "./prisma";
import { generateUrlId } from "@/utils/url-id";
import { OptionResult, Poll, PollResults } from "@/types/models";
import { revalidatePath } from "next/cache";
import { z } from "zod";

// TODO: data validation and error handling including character and other limits
// TODO: minimize db fetch calls by providing enough info (like ID) to create with a single request

export async function createGroup(formData: FormData) {
  const rawFormData = {
    name: formData.get("groupName"),
  };

  if (!rawFormData.name) {
    console.log("Group name is empty");
    return;
  }

  const groupName = rawFormData.name.toString();

  if (groupName.length < 1) {
    console.log("Group name length is less than 1");
    return;
  }

  const urlId = generateUrlId();

  await prisma.pollGroup.create({
    data: {
      id: urlId,
      name: groupName,
    },
  });

  if (rawFormData.name) {
    redirect(`/${urlId}`);
  }
}

export async function createPoll(groupId: string, formData: FormData) {
  const rawFormData = {
    title: formData.get("pollTitle"),
    options: formData.getAll("option"),
  };

  if (!rawFormData.title) {
    console.log("Poll title is empty");
    return;
  }

  const pollTitle = rawFormData.title.toString();

  let pollOptions: string[] = [];

  rawFormData.options.map((option) => {
    pollOptions.push(option.toString());
  });

  const filteredOptions: string[] = pollOptions.filter((option) => {
    return option.length > 0;
  });

  if (filteredOptions.length < 2) {
    console.log("There are less than two non-empty poll options");
    return;
  }

  const group = await prisma.pollGroup.findUnique({
    where: { id: groupId },
    include: { polls: true },
  });

  if (!group) {
    console.log("Error: Could not find group with urlId " + groupId);
    return;
  }

  const pollUrlId = group.polls.length + 1;

  let options: { option: string }[] = [];
  filteredOptions.map((pollOption) => {
    options.push({
      option: pollOption,
    });
  });

  const createdPoll = await prisma.poll.create({
    data: {
      urlId: pollUrlId,
      question: pollTitle,
      pollGroupId: group.id,
      options: {
        create: options,
      },
    },
  });

  revalidatePath(`/${groupId}`);
  redirect(`/${groupId}/${createdPoll.urlId}/vote`);
}

export async function getPollsForGroup(pollGroupUrlId: string) {
  console.log("getting polls for group " + pollGroupUrlId);
  const pollGroup = await prisma.pollGroup.findUnique({ where: { id: pollGroupUrlId } });
  if (!pollGroup?.id) {
    console.log("Could not find a poll group with ID " + pollGroup?.id);
    return [];
  }
  const polls = await prisma.poll.findMany({
    where: { pollGroupId: pollGroup.id },
    include: { options: { include: { responses: true } } },
  });
  return polls;
}

export async function getPollResults(pollGroupUrlId: string, pollUrlId: number) {
  const pollGroup = await prisma.pollGroup.findUnique({ where: { id: pollGroupUrlId } });
  if (!pollGroup?.id) {
    console.log("Could not find a poll group with ID " + pollGroup?.id);
    return;
  }
  const poll = await prisma.poll.findUnique({
    where: {
      urlId_pollGroupId: {
        urlId: pollUrlId,
        pollGroupId: pollGroup.id,
      },
    },
    include: {
      options: {
        include: {
          responses: true,
        },
      },
    },
  });

  if (!poll) {
    console.log("Could not find a poll in group " + pollGroup.id + " with urlId " + pollGroupUrlId);
    return;
  }

  const optionResults: OptionResult[] = poll.options.map((option) => {
    return {
      option: option.option,
      responseCount: option.responses.length,
    };
  });

  let responseCount = 0;
  optionResults.map((result) => {
    responseCount += result.responseCount ?? 0;
  });

  const pollResults: PollResults = {
    question: poll.question,
    createdAt: poll.createdAt,
    responseCount: responseCount,
    optionResults: optionResults,
  };

  return pollResults;
}

export async function getPoll(
  pollGroupUrlId: string,
  pollUrlId: number
): Promise<Poll | undefined> {
  const pollGroup = await prisma.pollGroup.findUnique({ where: { id: pollGroupUrlId } });
  if (!pollGroup?.id) {
    console.log("Could not find a poll group with ID " + pollGroup?.id);
    return;
  }
  const poll = await prisma.poll.findUnique({
    where: {
      urlId_pollGroupId: {
        urlId: pollUrlId,
        pollGroupId: pollGroup.id,
      },
    },
    include: {
      options: true,
    },
  });

  if (!poll) {
    console.log("Could not find a poll in group " + pollGroup.id + " with urlId " + pollGroupUrlId);
    return;
  }

  return poll;
}

const VoteFormSchema = z.object({
  option: z.string(),
});

export async function submitVote(pollGroupUrlId: string, pollUrlId: number, formData: FormData) {
  const { option } = VoteFormSchema.parse({
    option: formData.get("option"),
  });

  if (option) {
    await prisma.response.create({
      data: {
        optionId: option,
        ipAddress: "fake.ip.address",
      },
    });

    revalidatePath(`/${pollGroupUrlId}/${pollUrlId}`);
    redirect(`/${pollGroupUrlId}/${pollUrlId}/results`);
  } else {
    console.log("No option selected");
  }
}
