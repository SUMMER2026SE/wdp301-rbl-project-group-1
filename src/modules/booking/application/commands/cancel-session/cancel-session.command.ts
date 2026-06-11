export class CancelSessionCommand {
  constructor(
    public readonly sessionId: string,
    public readonly userId: string,
    public readonly reason: string,
  ) {}
}
