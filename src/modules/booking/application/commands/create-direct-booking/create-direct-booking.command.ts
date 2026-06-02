export class CreateDirectBookingCommand {
  constructor(
    public readonly studentId: string,
    public readonly tutorId: string,
    public readonly subjectId: string | null,
    public readonly mode: string,
    public readonly message: string | null,
    public readonly totalSessions: number,
    public readonly scheduleRules: {
      dayOfWeek: number;
      startTime: string;
      endTime: string;
    }[],
  ) {}
}
