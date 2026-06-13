export class MarkReadCommand {
  constructor(
    public readonly userId: string,
    public readonly conversationId: string,
    public readonly lastMessageId: string,
  ) {}
}
