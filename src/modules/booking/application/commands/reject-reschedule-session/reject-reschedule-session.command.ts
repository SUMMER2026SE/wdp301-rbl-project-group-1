export class RejectRescheduleSessionCommand {
  constructor(
    public readonly sessionId: string,
    public readonly userId: string,
  ) {}
}
