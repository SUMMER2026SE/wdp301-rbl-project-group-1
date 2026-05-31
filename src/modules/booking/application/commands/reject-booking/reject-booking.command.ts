export class RejectBookingCommand {
  constructor(
    public readonly bookingId: string,
    public readonly tutorId: string,
  ) {}
}
