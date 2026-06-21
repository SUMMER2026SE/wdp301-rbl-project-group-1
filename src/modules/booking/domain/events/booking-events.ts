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

export class SessionRescheduleRequestedEvent {
  constructor(
    public readonly sessionId: string,
    public readonly studentId: string,
    public readonly tutorId: string,
    public readonly requestedBy: string,
    public readonly newStartTime: string,
  ) {}
}

export class SessionRescheduleApprovedEvent {
  constructor(
    public readonly sessionId: string,
    public readonly studentId: string,
    public readonly tutorId: string,
    public readonly approvedBy: string,
  ) {}
}

export class SessionRescheduleRejectedEvent {
  constructor(
    public readonly sessionId: string,
    public readonly studentId: string,
    public readonly tutorId: string,
    public readonly rejectedBy: string,
  ) {}
}
