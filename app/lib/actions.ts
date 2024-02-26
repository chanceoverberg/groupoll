"use server";

import { redirect } from "next/navigation";
import prisma from "./prisma";
import { generateUrlId } from "@/utils/url-id";
import { OptionResult, Poll, PollGroup, PollResults } from "@/types/models";
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

export async function createPoll(pollGroupId: string, formData: FormData) {
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

  const pollGroup = await prisma.pollGroup.findUnique({
    where: { id: pollGroupId },
    include: { polls: true, webhooks: true },
  });

  if (!pollGroup) {
    console.log("Error: Could not find group with id " + pollGroupId);
    return;
  }

  const pollUrlId = pollGroup.polls.length + 1;

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
      pollGroupId: pollGroup.id,
      options: {
        create: options,
      },
    },
  });

  await Promise.all(
    pollGroup.webhooks.map(async (webhook) => {
      await postDiscordMessage(pollGroup, createdPoll, webhook.id);
    })
  );

  revalidatePath(`/${pollGroupId}`);
  redirect(`/${pollGroupId}/${createdPoll.urlId}/vote`);
}

// TODO: sort by created date, most recent at the top
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

// TODO: check ip address and don't allow voting if they have already voted

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

const discordWebhookRegex = /https:\/\/discord\.com\/api\/webhooks\/.+\/.+/;
const WebhookFormSchema = z.object({
  webhook: z
    .string()
    .url({ message: "Invalid URL" })
    .regex(discordWebhookRegex, "Only Discord webhooks are supported right now"),
});

export async function registerWebhook(pollGroupId: string, formData: FormData) {
  const validatedFields = WebhookFormSchema.safeParse({
    webhook: formData.get("webhook"),
  });

  if (!validatedFields.success) {
    console.log("Invalid URL. Cannot register the webhook.");
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Invalid URL. Cannot register the webhook.",
    };
  }

  const { webhook } = validatedFields.data;

  try {
    const response = await fetch(`${webhook}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.status != 200) {
      console.log("Webhook registration failed with error code: " + response.status);
      try {
        const responseJSON = await response.json();
        console.log(responseJSON);
      } catch (err) {
        console.log(err);
      }
      return;
    }
  } catch (err) {
    console.log("Error validating the webhook URL:");
    console.log(err);
    return;
  }

  await prisma.pollGroup.update({
    where: {
      id: pollGroupId,
    },
    data: {
      webhooks: {
        connectOrCreate: {
          where: {
            id: webhook,
          },
          create: {
            id: webhook,
          },
        },
      },
    },
  });

  console.log("Webhook URL registered to group " + pollGroupId + ": " + webhook);
}

// TODO: add a toast if this fails with the message from the response
export async function postDiscordMessage(pollGroup: PollGroup, poll: Poll, webhookUrl: string) {
  const title: string = "New poll created for " + pollGroup.name + "!";
  const description: string = "Question: " + poll.question;
  const embed = [
    {
      title: title,
      description: description,
      url: `http://localhost:3000/${pollGroup.id}/${poll.urlId}/vote`,
    },
  ];

  try {
    const response = await fetch(`${webhookUrl}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        embeds: embed,
      }),
    });

    if (response.status != 204) {
      try {
        const responseJSON = await response.json();
        if (responseJSON.code == 10015) {
          console.log("Deleting the following webhook from the following group:");
          console.log("pollgroup id: " + pollGroup.id);
          console.log("webhook url: " + webhookUrl);
          try {
            await prisma.$transaction([
              prisma.pollGroup.update({
                where: {
                  id: pollGroup.id,
                },
                data: {
                  webhooks: {
                    disconnect: [{ id: webhookUrl }],
                  },
                },
              }),
              prisma.webhook.delete({
                where: {
                  id: webhookUrl,
                },
              }),
            ]);
          } catch (dberror) {
            console.log("Error deleting webhook:");
            console.log(dberror);
          }
        }
      } catch (err) {
        console.log("parse error: " + err);
      }
    }
  } catch (responseError) {
    console.log("fetch error: " + responseError);
  }
}
