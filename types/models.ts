export interface Poll {
  id: string;
  urlId: number;
  question: string;
  createdAt: Date;
  pollGroupId: string;
  options?: Option[];
}

export interface Option {
  id: string;
  option: string;
  pollId: string;
  responses?: Response[];
}

export interface Response {
  id: string;
  createdAt: Date;
  optionId: string;
  ipAddress: string;
}

export interface PollResults {
  pollGroupName?: string;
  question?: string;
  responseCount?: number;
  createdAt?: Date;
  optionResults?: OptionResult[];
}

export interface OptionResult {
  option?: string;
  responseCount?: number;
}
