export class CreateQuestionBankCommand {
  constructor(
    public readonly tutorId: string,
    public readonly courseId: string,
    public readonly title: string,
    public readonly description?: string,
  ) {}
}
