export class CreateDisputeCommand {
  constructor(
    public readonly reporterId: string,
    public readonly bookingId: string | null,
    public readonly sessionId: string | null,
    public readonly reason: string,
    public readonly role: 'STUDENT' | 'TUTOR',
  ) {}
}
