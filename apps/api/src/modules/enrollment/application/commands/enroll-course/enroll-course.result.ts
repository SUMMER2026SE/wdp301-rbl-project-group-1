export class EnrollCourseResult {
  constructor(
    public readonly id: string,
    public readonly status: string,
    public readonly enrolledAt: Date,
  ) {}
}
