export class ConfirmSessionAttendanceResult {
  constructor(
    public readonly id: string,
    public readonly sessionId: string,
    public readonly studentId: string,
    public readonly status: string,
    public readonly notes: string | null,
    public readonly createdAt: string,
  ) {}
}
