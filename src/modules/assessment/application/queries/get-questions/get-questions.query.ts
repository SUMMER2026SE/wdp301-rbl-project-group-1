export class GetQuestionsQuery {
  constructor(
    public readonly bankId: string,
    public readonly skip: number = 0,
    public readonly limit: number = 20,
  ) {}
}
