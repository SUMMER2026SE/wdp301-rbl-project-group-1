export class AcceptTutorBidCommand {
  constructor(
    public readonly requestId: string,
    public readonly bidId: string,
    public readonly studentId: string,
  ) {}
}
