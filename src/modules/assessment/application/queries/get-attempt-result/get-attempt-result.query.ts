export class GetAttemptResultQuery {
  constructor(
    public readonly attemptId: string,
    public readonly studentId: string,
  ) {}
}
