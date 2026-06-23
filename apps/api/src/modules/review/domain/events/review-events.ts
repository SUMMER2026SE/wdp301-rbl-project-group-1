export class ReviewCreatedEvent {
  constructor(
    public readonly reviewId: string,
    public readonly bookingId: string,
    public readonly tutorId: string,
    public readonly studentId: string,
    public readonly rating: number,
  ) {}
}
