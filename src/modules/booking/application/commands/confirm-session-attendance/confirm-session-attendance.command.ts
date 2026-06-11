export class ConfirmSessionAttendanceCommand {
  constructor(
    public readonly sessionId: string,
    public readonly studentId: string,
    public readonly notes: string | null,
  ) {}
}
