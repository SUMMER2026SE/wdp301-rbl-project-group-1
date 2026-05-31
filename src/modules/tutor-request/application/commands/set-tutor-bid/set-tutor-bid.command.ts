export class SetTutorBidCommand {
  constructor(
    public readonly requestId: string,
    public readonly tutorId: string,
    public readonly proposedPrice?: number,
    public readonly message?: string,
  ) {}
}
