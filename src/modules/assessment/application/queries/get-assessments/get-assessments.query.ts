export class GetAssessmentsQuery {
  constructor(
    public readonly courseId: string,
    public readonly lessonId?: string,
  ) {}
}
