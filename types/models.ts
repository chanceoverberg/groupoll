export interface Poll {
    id: number,
    urlId: number,
    question: string,
    createdAt: Date,
    surveyGroupId: number,
    options?: Option[]
}

export interface Option {
    id: number,
    option: string,
    surveyId: number
    responses?: Response[]
}

export interface Response {
    id: number,
    createdAt: Date,
    optionId: number,
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