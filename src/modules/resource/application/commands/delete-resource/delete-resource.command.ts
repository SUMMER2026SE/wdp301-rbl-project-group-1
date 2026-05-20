export class DeleteResourceCommand {
  constructor(
    public readonly userId: string,
    public readonly resourceId: string,
  ) {}
}
