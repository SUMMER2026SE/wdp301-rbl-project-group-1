export class ResolveDisputeResult {
  constructor(
    public readonly id: string,
    public readonly bookingId: string | null,
    public readonly sessionId: string | null,
    public readonly reporterId: string,
    public readonly targetId: string | null,
    public readonly reason: string,
    public readonly status: string,
    public readonly createdAt: string,
    public readonly updatedAt: string,
  ) {}
}
