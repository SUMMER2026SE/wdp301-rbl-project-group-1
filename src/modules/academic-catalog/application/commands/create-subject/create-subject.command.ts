export class CreateSubjectCommand {
  constructor(
    public readonly name: string,
    public readonly slug: string,
  ) {}
}
