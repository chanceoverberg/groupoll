"use server";

import { redirect } from "next/navigation";
import prisma from "./prisma";
import { generateUrlId } from "@/utils/url-id";
import { OptionResult, Poll, PollResults } from "@/types/models";
import { revalidatePath } from "next/cache";
import { z } from "zod";

// TODO: data validation and error handling including character and other limits

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

export async function getPollsForGroup(pollGroupId: string) {
  console.log("getting polls for group " + pollGroupId);

  const polls = await prisma.poll.findMany({
    where: { pollGroupId: pollGroupId },
    include: { options: { include: { responses: true } } },
  });

  return polls;
}

export async function getPollGroup(pollGroupId: string) {
  const pollGroup = await prisma.pollGroup.findUnique({ where: { id: pollGroupId } });
  return pollGroup ?? undefined;
}

export async function getPollResults(pollGroupId: string, pollUrlId: number) {
  const poll = await prisma.poll.findUnique({
    where: {
      urlId_pollGroupId: {
        urlId: pollUrlId,
        pollGroupId: pollGroupId,
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
    console.log("Could not find a poll in group with id " + pollGroupId);
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

export async function getPoll(pollGroupId: string, pollUrlId: number): Promise<Poll | undefined> {
  const poll = await prisma.poll.findUnique({
    where: {
      urlId_pollGroupId: {
        urlId: pollUrlId,
        pollGroupId: pollGroupId,
      },
    },
    include: {
      options: true,
    },
  });

  if (!poll) {
    console.log("Could not find a poll in group with id " + pollGroupId);
    return;
  }

  return poll;
}

const VoteFormSchema = z.object({
  option: z.string({ invalid_type_error: "Please select an option." }),
});

export async function submitVote(pollGroupId: string, pollUrlId: number, formData: FormData) {
  const validatedFields = VoteFormSchema.safeParse({
    option: formData.get("option"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "No option selected. Cannot submit vote.",
    };
  }

  const { option } = validatedFields.data;

  await prisma.response.create({
    data: {
      optionId: option,
      ipAddress: "fake.ip.address",
    },
  });

  revalidatePath(`/${pollGroupId}/${pollUrlId}`);
  redirect(`/${pollGroupId}/${pollUrlId}/results`);
}
