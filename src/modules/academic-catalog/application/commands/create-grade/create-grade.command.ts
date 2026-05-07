export class CreateGradeCommand {
  constructor(
    public readonly name: string,
    public readonly slug: string,
    public readonly order: number,
  ) {}
}
