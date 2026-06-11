export class RescheduleSessionCommand {
  constructor(
    public readonly sessionId: string,
    public readonly userId: string,
    public readonly proposedStartTime: string,
    public readonly proposedEndTime: string,
    public readonly reason: string,
  ) {}
}
