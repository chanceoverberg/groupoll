'use server';

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
        name: formData.get('groupName'),
    };

    if (!rawFormData.name) {
        console.log("Group name is empty");
        return;
    }

    const groupName = rawFormData.name.toString();

    if (groupName.length < 3) {
        console.log("Group name length is less than 3");
        return;
    }

    const urlId = generateUrlId();

    await prisma.surveyGroup.create({
        data: {
            id: urlId,
            name: groupName,
        }
    });

    if (rawFormData.name) {
        redirect(`/${urlId}`);
    }
}

export async function createPoll(surveyGroupUrlId: string, formData: FormData) {
    const rawFormData = {
        title: formData.get('pollTitle'),
        options: formData.getAll('option'),
    };

    if (!rawFormData.title) {
        console.log("Poll title is empty");
        return;
    }

    const pollTitle = rawFormData.title.toString();

    let pollOptions: string[] = [];

    rawFormData.options.map((option) => {pollOptions.push(option.toString())});

    const filteredOptions: string[] = pollOptions.filter((option) => {
        return option.length > 0;
    });

    if (filteredOptions.length < 2) {
        console.log("There are less than two non-empty poll options");
        return;
    }

    const group = await prisma.surveyGroup.findUnique({where: {id: surveyGroupUrlId}, include: {surveys: true}});

    if (!group) {
        console.log("Error: Could not find group with urlId " + surveyGroupUrlId);
        return;
    }

    const surveyUrlId = group.surveys.length + 1;

    let options: { option: string }[] = [];
    filteredOptions.map((pollOption) => {
        options.push({
            option: pollOption,
        });
    });

    const createdSurvey = await prisma.survey.create({data: {
        urlId: surveyUrlId,
        question: pollTitle,
        surveyGroupId: group.id,
        options: {
            create: options,
        }
    }});

    revalidatePath(`/${surveyGroupUrlId}`);
    redirect(`/${surveyGroupUrlId}/${createdSurvey.urlId}/vote`);
}

export async function getPollsForGroup(surveyGroupUrlId: string) {
    console.log("getting polls for group " + surveyGroupUrlId);
    const surveyGroup = await prisma.surveyGroup.findUnique({where: {id: surveyGroupUrlId}});
    if (!surveyGroup?.id) {
        console.log("Could not find a poll group with ID " + surveyGroup?.id);
        return [];
    }
    const polls = await prisma.survey.findMany({where: {surveyGroupId: surveyGroup.id}, include: {options: {include: {responses: true}}}});
    return polls;
}

export async function getPollResults(surveyGroupUrlId: string, surveyUrlId: number) {
    const surveyGroup = await prisma.surveyGroup.findUnique({where: {id: surveyGroupUrlId}});
    if (!surveyGroup?.id) {
        console.log("Could not find a poll group with ID " + surveyGroup?.id);
        return;
    }
    const poll = await prisma.survey.findUnique({
        where: {
            urlId_surveyGroupId: {
                urlId: surveyUrlId, 
                surveyGroupId: surveyGroup.id
            }
        }, 
        include: {
            options: {
                include: {
                    responses: true
                }
            }
        }
    });

    if (!poll) {
        console.log("Could not find a poll in group " + surveyGroup.id + " with urlId " + surveyGroupUrlId);
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
    })

    const pollResults: PollResults = {
        question: poll.question,
        createdAt: poll.createdAt,
        responseCount: responseCount,
        optionResults: optionResults,
    }

    return pollResults;
}

export async function getPoll(surveyGroupUrlId: string, surveyUrlId: number): Promise<Poll | undefined> {
    const surveyGroup = await prisma.surveyGroup.findUnique({where: {id: surveyGroupUrlId}});
    if (!surveyGroup?.id) {
        console.log("Could not find a poll group with ID " + surveyGroup?.id);
        return;
    }
    const poll = await prisma.survey.findUnique({
        where: {
            urlId_surveyGroupId: {
                urlId: surveyUrlId, 
                surveyGroupId: surveyGroup.id
            }
        }, 
        include: {
            options: true
        }
    });

    if (!poll) {
        console.log("Could not find a poll in group " + surveyGroup.id + " with urlId " + surveyGroupUrlId);
        return;
    }

    return poll;
}

const VoteFormSchema = z.object({
    option: z.string()
});

export async function submitVote(surveyGroupUrlId: string, surveyUrlId: number, formData: FormData) {
    const { option } = VoteFormSchema.parse({
        option: formData.get('option')
    })
    
    if (option) {
        await prisma.response.create({data: {
            optionId: option,
            ipAddress: "fake.ip.address",
        }});

        revalidatePath(`/${surveyGroupUrlId}/${surveyUrlId}`);
        redirect(`/${surveyGroupUrlId}/${surveyUrlId}/results`);
    }
    else {
        console.log("No option selected");
    }
}