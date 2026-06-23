export class CreateReviewCommand {
  constructor(
    public readonly bookingId: string,
    public readonly studentId: string,
    public readonly rating: number,
    public readonly comment: string | null,
  ) {}
}
