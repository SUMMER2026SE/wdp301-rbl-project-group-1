export class GetJoinedStudentsQuery {
  constructor(
    public readonly tutorId: string,
    public readonly courseId: string,
  ) {}
}
