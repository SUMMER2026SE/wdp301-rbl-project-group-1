export class AcceptBookingCommand {
  constructor(
    public readonly bookingId: string,
    public readonly tutorId: string,
  ) {}
}
