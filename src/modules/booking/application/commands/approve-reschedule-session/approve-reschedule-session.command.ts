export class ApproveRescheduleSessionCommand {
  constructor(
    public readonly sessionId: string,
    public readonly userId: string,
  ) {}
}
