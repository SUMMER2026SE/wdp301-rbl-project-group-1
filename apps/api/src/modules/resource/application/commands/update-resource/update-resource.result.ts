export class UpdateResourceResult {
  constructor(
    public readonly resourceIds: string[],
    public readonly removedCount?: number,
  ) {}
}
