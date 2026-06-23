export class SendDisputeMessageResult {
  constructor(
    public readonly id: string,
    public readonly ticketId: string,
    public readonly senderId: string,
    public readonly content: string,
    public readonly createdAt: string,
  ) {}
}
