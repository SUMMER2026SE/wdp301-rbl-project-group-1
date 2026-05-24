import { AttendanceStatus } from '../../../../../shared/domain/enums/enums';

export interface MarkAttendanceItem {
  studentId: string;
  status: AttendanceStatus;
  note?: string;
}

export class MarkAttendanceCommand {
  constructor(
    public readonly tutorId: string,
    public readonly lessonId: string,
    public readonly attendances: MarkAttendanceItem[],
  ) {}
}
