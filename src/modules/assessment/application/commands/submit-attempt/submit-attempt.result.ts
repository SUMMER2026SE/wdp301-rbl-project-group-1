export class SubmitAttemptResult {
  constructor(
    public readonly attemptId: string,
    public readonly score: number,
    public readonly isPassed: boolean,
    public readonly totalPoints: number,
    public readonly earnedPoints: number,
  ) {}
}
