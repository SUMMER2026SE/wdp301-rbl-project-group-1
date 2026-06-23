export class CreateConversationResult {
  constructor(
    public readonly id: string,
    public readonly type: string,
    public readonly name: string | null,
    public readonly createdAt: string,
  ) {}
}
