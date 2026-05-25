import {
  AttendanceStatus,
  LessonStatus,
} from '../../../../../shared/domain/enums/enums';

export interface StudentScheduleResultData {
  id: string;
  courseId: string;
  courseTitle: string;
  tutorNickname: string | null;
  tutorAvatarUrl: string | null;
  title: string;
  meetingUrl: string | null;
  videoUrl: string | null;
  startTime: Date;
  endTime: Date | null;
  status: LessonStatus;
  attendance: {
    status: AttendanceStatus;
    note: string | null;
  } | null;
}
