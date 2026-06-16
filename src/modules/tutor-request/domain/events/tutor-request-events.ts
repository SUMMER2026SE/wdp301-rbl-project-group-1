export class TutorRequestCreatedEvent {
  constructor(
    public readonly requestId: string,
    public readonly studentId: string,
    public readonly subjectId: string,
    public readonly title: string,
  ) {}
}

export class BidPlacedEvent {
  constructor(
    public readonly bidId: string,
    public readonly requestId: string,
    public readonly tutorId: string,
    public readonly studentId: string,
    public readonly message: string,
  ) {}
}

export class BidAcceptedEvent {
  constructor(
    public readonly bidId: string,
    public readonly requestId: string,
    public readonly tutorId: string,
    public readonly studentId: string,
  ) {}
}
