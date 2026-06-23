export class SendDisputeMessageCommand {
  constructor(
    public readonly ticketId: string,
    public readonly senderId: string,
    public readonly role: 'STUDENT' | 'TUTOR' | 'ADMIN',
    public readonly content: string,
  ) {}
}
