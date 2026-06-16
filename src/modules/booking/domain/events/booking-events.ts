export class BookingCreatedEvent {
  constructor(
    public readonly bookingId: string,
    public readonly studentId: string,
    public readonly tutorId: string,
    public readonly message: string,
  ) {}
}

export class BookingAcceptedEvent {
  constructor(
    public readonly bookingId: string,
    public readonly studentId: string,
    public readonly tutorId: string,
  ) {}
}

export class BookingRejectedEvent {
  constructor(
    public readonly bookingId: string,
    public readonly studentId: string,
    public readonly tutorId: string,
  ) {}
}
