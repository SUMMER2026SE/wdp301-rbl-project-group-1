export class MarkSessionAttendanceCommand {
  constructor(
    public readonly sessionId: string,
    public readonly tutorId: string,
    public readonly studentId: string,
    public readonly status: string,
    public readonly notes: string | null,
  ) {}
}
