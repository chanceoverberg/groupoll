"use server";

import { redirect } from "next/navigation";
import prisma from "./prisma";
import { generateUrlId } from "@/utils/url-id";
import { OptionResult, Poll, PollGroup, PollResults } from "@/types/models";
import { revalidatePath } from "next/cache";
import { z } from "zod";

// TODO (u/o): change "get" to "fetch" and move those functions to a different file in lib called data.ts

const FormSchema = z.object({
  groupName: z
    .string({ invalid_type_error: "Please enter a group name." })
    .min(1, "Group name cannot be empty.")
    .max(50, "Maximum group name length is 50 characters."),
  pollTitle: z
    .string({ invalid_type_error: "Please enter a poll title." })
    .min(1, "Poll title cannot be empty.")
    .max(100, "Maximum poll title length is 100 characters."),
  pollOptions: z
    .array(
      z
        .string({ invalid_type_error: "Please enter an option." })
        .min(1, "Poll option cannot be empty.")
        .max(75, "Maximum option length is 75 characters.")
    )
    .min(2, "There must be at least 2 options.")
    .max(16, "There can only be a maximum of 16 options."),
  voteOption: z.string({ invalid_type_error: "Please select an option." }),
});

// Use Zod to update the expect types
const CreateGroup = FormSchema.omit({ pollTitle: true, pollOptions: true, voteOption: true });
const CreatePoll = FormSchema.omit({ groupName: true, voteOption: true });
const SubmitVote = FormSchema.omit({ groupName: true, pollTitle: true, pollOptions: true });

// This is temporary until @types/react-dom is updated
export type CreateGroupState = {
  errors?: {
    groupName?: string[];
  };
  message?: string | null;
};

export async function createGroup(prevState: CreateGroupState, formData: FormData) {
  const validatedFields = CreateGroup.safeParse({
    groupName: formData.get("groupName"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing fields. Failed to create group.",
    };
  }

  const { groupName } = validatedFields.data;

  const urlId = generateUrlId();

  try {
    await prisma.pollGroup.create({
      data: {
        id: urlId,
        name: groupName,
      },
    });
  } catch (error) {
    return {
      message: "Database Error: Failed to create group.",
    };
  }

  redirect(`/${urlId}`);
}

// This is temporary until @types/react-dom is updated
export type CreatePollState = {
  errors?: z.ZodIssue[] | null;
  message?: string | null;
};

export async function createPoll(
  pollGroupId: string,
  prevState: CreatePollState | undefined,
  formData: FormData
) {
  const validatedFields = CreatePoll.safeParse({
    pollTitle: formData.get("pollTitle"),
    pollOptions: formData.getAll("pollOption"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.errors,
      message: "Missing Fields. Failed to create poll.",
    };
  }

  const { pollTitle, pollOptions } = validatedFields.data;

  let createdPoll: Poll;

  try {
    const pollGroup = await prisma.pollGroup.findUnique({
      where: { id: pollGroupId },
      include: {
        polls: {
          orderBy: {
            createdAt: "desc",
          },
          take: 1,
        },
        webhooks: true,
      },
    });

    if (!pollGroup) {
      return {
        message: "Failed to retrieve poll group.",
      };
    }

    // Set the new poll's URL ID to be 1 higher than the URL ID of the newest poll in the group
    let pollUrlId = 1;
    if (pollGroup.polls && pollGroup.polls.length > 0) {
      pollUrlId = pollGroup.polls[0].urlId + 1;
    }

    let options: { option: string }[] = [];
    pollOptions.map((pollOption) => {
      options.push({
        option: pollOption,
      });
    });

    createdPoll = await prisma.poll.create({
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
  } catch (error) {
    return {
      message: "Database error: Failed to create poll.",
    };
  }
  redirect(`/${pollGroupId}/${createdPoll.urlId}/vote`);
}

export async function getPollsForGroup(pollGroupId: string) {
  try {
    const polls = await prisma.poll.findMany({
      orderBy: [
        {
          createdAt: "desc",
        },
      ],
      where: {
        pollGroupId: pollGroupId,
      },
      include: {
        options: {
          include: {
            responses: true,
          },
        },
      },
    });

    return polls;
  } catch (error) {
    throw new Error("Failed to fetch polls.");
  }
}

export async function getPollGroup(pollGroupId: string) {
  try {
    const pollGroup = await prisma.pollGroup.findUnique({ where: { id: pollGroupId } });
    return pollGroup ?? undefined;
  } catch (error) {
    throw new Error("Failed to fetch poll group.");
  }
}

export async function getPollResults(pollGroupId: string, pollUrlId: number) {
  try {
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
      throw new Error("Database error: Failed to get results for poll.");
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
  } catch (error) {
    throw new Error("Database error: Failed to get results for poll.");
  }
}

export async function getPoll(pollGroupId: string, pollUrlId: number): Promise<Poll | undefined> {
  let poll: Poll | null;

  try {
    poll = await prisma.poll.findUnique({
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
      throw new Error("Database error: Failed to retrieve poll.");
    }
  } catch (error) {
    console.log(error);
    throw new Error("Database error: Failed to retrieve poll.");
  }

  return poll;
}

export async function getHasVoted(
  pollId: string | undefined,
  ipAddress: string | undefined
): Promise<boolean> {
  if (!pollId || !ipAddress) {
    return false;
  }

  try {
    const response = await prisma.response.findUnique({
      where: {
        ipAddress_pollId: {
          ipAddress: ipAddress,
          pollId: pollId,
        },
      },
    });

    return response == null ? false : true;
  } catch (error) {
    return false;
  }
}

export type SubmitVoteState = {
  errors: {
    voteOption?: string[];
  };
  message?: string | null;
};

export async function submitVote(
  pollGroupId: string,
  poll: Poll | undefined,
  data: any,
  prevState: SubmitVoteState,
  formData: FormData
) {
  if (!poll) {
    return {
      errors: {
        voteOption: [],
      },
      message: "No poll was given.",
    };
  }

  const validatedFields = SubmitVote.safeParse({
    voteOption: formData.get("voteOption"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "",
    };
  }

  const { voteOption } = validatedFields.data;

  let ipAddress;

  if (data && data.ip) {
    ipAddress = data.ip;
  }

  if (await getHasVoted(poll.id, ipAddress)) {
    return {
      errors: {
        voteOption: [],
      },
      message: "You have already voted.",
    };
  }

  try {
    await prisma.response.create({
      data: {
        pollId: poll.id,
        optionId: voteOption,
        ipAddress: ipAddress,
      },
    });
  } catch (err) {
    return {
      errors: {
        voteOption: [],
      },
      message: "Database error: Failed to submit vote.",
    };
  }

  revalidatePath(`/${pollGroupId}/${poll.urlId}`);
  redirect(`/${pollGroupId}/${poll.urlId}/results`);
}

const discordWebhookRegex = /https:\/\/discord\.com\/api\/webhooks\/.+\/.+/;
const WebhookFormSchema = z.object({
  webhook: z
    .string()
    .max(191, "Maximum URL length is 191 characters.")
    .url({ message: "Invalid URL" })
    .regex(discordWebhookRegex, "Only Discord webhooks are supported right now."),
});

// This is temporary until @types/react-dom is updated
export type RegisterWebhookState = {
  errors: {
    webhook?: string[];
  };
  message?: string | null;
};

// TODO (u/o): show the error message when it fails using form state
export async function registerWebhook(
  pollGroupId: string,
  prevState: RegisterWebhookState,
  formData: FormData
) {
  const validatedFields = WebhookFormSchema.safeParse({
    webhook: formData.get("webhook"),
  });

  if (!validatedFields.success) {
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
      try {
        const responseJSON = await response.json();
        return {
          errors: {
            webhook: [
              (("Error code " + responseJSON.code) as string) +
                " from Discord. Unable to register the webhook.",
            ],
          },
          message: "There was an error validating the webhook URL. Please try again later.",
        };
      } catch (err) {
        return {
          errors: { webhook: ["Could not register the following URL: " + webhook] },
          message: "There was an error validating the webhook URL. Please try again later.",
        };
      }
    }
  } catch (err) {
    return {
      errors: { webhook: [] },
      message: "There was an error validating the webhook URL. Please try again later.",
    };
  }

  try {
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
  } catch (error) {
    return {
      errors: { webhook: [] },
      message: "Database error: Failed to register the webook in the database.",
    };
  }

  redirect(`/${pollGroupId}`);
}

// TODO (u/o): add a toast if this fails with the message from the response
export async function postDiscordMessage(pollGroup: PollGroup, poll: Poll, webhookUrl: string) {
  const title: string = "New poll created for group: " + pollGroup.name;
  const description: string = "Question: " + poll.question;
  const embed = [
    {
      title: title,
      description: description,
      url: `https://www.groupoll.net/${pollGroup.id}/${poll.urlId}/vote`,
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
            return {
              message: "Database error: Failed to delete the webhook.",
            };
          }
        }
      } catch (err) {
        return {
          message: "Failed to parse the JSON response.",
        };
      }
    }
  } catch (responseError) {
    return {
      message: "Failed to post message to Discord.",
    };
  }
}
