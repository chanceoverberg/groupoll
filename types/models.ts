export interface Poll {
    id: string,
    urlId: number,
    question: string,
    createdAt: Date,
    surveyGroupId: string,
    options?: Option[]
}

export interface Option {
    id: string,
    option: string,
    surveyId: string
    responses?: Response[]
}

export interface Response {
    id: string,
    createdAt: Date,
    optionId: string,
    ipAddress: string
}

export interface PollResults {
    question?: string,
    responseCount?: number,
    createdAt?: Date,
    optionResults?: OptionResult[]
}

export interface OptionResult {
    option?: string,
    responseCount?: number
}