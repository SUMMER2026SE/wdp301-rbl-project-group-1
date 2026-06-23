export interface ScheduleRuleDto {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
}

export class RenewBookingCommand {
  constructor(
    public readonly bookingId: string,
    public readonly studentId: string,
    public readonly totalSessions: number,
    public readonly message: string | null,
    public readonly scheduleRules?: ScheduleRuleDto[],
  ) {}
}
