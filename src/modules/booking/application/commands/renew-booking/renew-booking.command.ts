export class RenewBookingCommand {
  constructor(
    public readonly bookingId: string,
    public readonly studentId: string,
    public readonly totalSessions: number,
    public readonly message: string | null,
  ) {}
}
