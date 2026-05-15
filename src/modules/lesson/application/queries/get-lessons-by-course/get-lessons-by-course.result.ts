import { LessonStatus } from '../../../../../shared/domain/enums/enums';

export interface LessonByCourseResultData {
  id: string;
  courseId: string;
  title: string;
  content: string | null;
  meetingUrl: string | null;
  videoUrl: string | null;
  startTime: Date;
  endTime: Date | null;
  orderIndex: number;
  status: LessonStatus;
  createdAt: Date;
}
