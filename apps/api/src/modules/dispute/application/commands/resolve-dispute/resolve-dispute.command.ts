export class ResolveDisputeCommand {
  constructor(
    public readonly ticketId: string,
    public readonly resolution: 'REFUND' | 'REJECT',
  ) {}
}
