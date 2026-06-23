export class CreateReviewResult {
  constructor(
    public readonly id: string,
    public readonly bookingId: string,
    public readonly tutorId: string,
    public readonly studentId: string,
    public readonly rating: number,
    public readonly comment: string | null,
    public readonly createdAt: string,
  ) {}
}
