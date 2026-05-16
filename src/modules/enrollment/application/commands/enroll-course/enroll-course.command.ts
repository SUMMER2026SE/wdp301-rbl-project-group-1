export class EnrollCourseCommand {
  constructor(
    public readonly studentId: string,
    public readonly courseId: string,
  ) {}
}
