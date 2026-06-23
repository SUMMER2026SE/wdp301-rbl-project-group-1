export class DisputeSessionCommand {
  constructor(
    public readonly sessionId: string,
    public readonly studentId: string,
    public readonly reason: string,
  ) {}
}
