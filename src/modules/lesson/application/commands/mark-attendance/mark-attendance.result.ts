import { AttendanceStatus } from '../../../../../shared/domain/enums/enums';

export interface MarkAttendanceResultItem {
  id: string;
  lessonId: string;
  studentId: string;
  status: AttendanceStatus;
  note: string | null;
  markedAt: Date;
}

export class MarkAttendanceResult {
  constructor(public readonly attendances: MarkAttendanceResultItem[]) {}
}
