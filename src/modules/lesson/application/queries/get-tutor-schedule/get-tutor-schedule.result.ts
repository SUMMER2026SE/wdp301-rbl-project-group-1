import { LessonStatus } from '../../../../../shared/domain/enums/enums';

export interface TutorScheduleResultData {
  id: string;
  courseId: string;
  courseTitle: string;
  title: string;
  meetingUrl: string | null;
  videoUrl: string | null;
  startTime: Date;
  endTime: Date | null;
  status: LessonStatus;
  enrolledStudentCount: number;
  attendanceMarked: boolean;
}
