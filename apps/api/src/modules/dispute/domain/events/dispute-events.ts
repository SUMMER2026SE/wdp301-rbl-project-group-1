export class DisputeCreatedEvent {
  constructor(
    public readonly ticketId: string,
    public readonly reporterId: string,
    public readonly targetId: string,
    public readonly reason: string,
  ) {}
}

export class DisputeResolvedEvent {
  constructor(
    public readonly ticketId: string,
    public readonly reporterId: string,
    public readonly targetId: string,
    public readonly resolution: string,
    public readonly refundAmount?: number,
  ) {}
}
