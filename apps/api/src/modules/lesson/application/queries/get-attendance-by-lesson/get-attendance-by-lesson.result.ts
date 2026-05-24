import { AttendanceStatus } from '../../../../../shared/domain/enums/enums';

export interface AttendanceByLessonResultData {
  id: string;
  lessonId: string;
  studentId: string;
  status: AttendanceStatus;
  note: string | null;
  markedAt: Date;
  updatedAt: Date;
}

export class GetAttendanceByLessonResult {
  constructor(public readonly attendances: AttendanceByLessonResultData[]) {}
}
