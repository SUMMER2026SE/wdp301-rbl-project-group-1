export class StartAttemptCommand {
  constructor(
    public readonly studentId: string,
    public readonly assessmentId: string,
  ) {}
}
