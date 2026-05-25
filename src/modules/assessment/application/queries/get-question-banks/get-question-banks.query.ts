export class GetQuestionBanksQuery {
  constructor(
    public readonly courseId: string,
    public readonly skip: number = 0,
    public readonly limit: number = 20,
  ) {}
}
