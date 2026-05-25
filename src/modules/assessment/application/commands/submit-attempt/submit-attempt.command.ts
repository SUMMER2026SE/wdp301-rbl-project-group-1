export interface AnswerInput {
  questionId: string;
  optionIds: string[];
  textAnswer?: string;
}

export class SubmitAttemptCommand {
  constructor(
    public readonly studentId: string,
    public readonly attemptId: string,
    public readonly answers: AnswerInput[],
  ) {}
}
