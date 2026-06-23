export class TakeAttendanceCommand {
  constructor(
    public readonly sessionId: string,
    public readonly tutorId: string,
    public readonly status: string,
    public readonly notes: string | null,
  ) {}
}
