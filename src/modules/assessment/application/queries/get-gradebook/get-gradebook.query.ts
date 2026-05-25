export class GetGradebookQuery {
  constructor(
    public readonly studentId: string,
    public readonly courseId: string,
  ) {}
}
