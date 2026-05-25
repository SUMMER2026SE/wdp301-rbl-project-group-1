import {
  QueryParams,
  QueryResult,
} from '../../../../shared/domain/common/query';
import {
  AttendanceStatus,
  LessonStatus,
} from '../../../../shared/domain/enums/enums';
import { Lesson } from '../entities/lesson.entity';

export interface LessonPaginatedParams extends QueryParams {
  courseId: string;
}

export interface StudentScheduleParams {
  studentId: string;
  startDate: Date;
  endDate: Date;
}

export interface TutorScheduleParams {
  tutorId: string;
  startDate: Date;
  endDate: Date;
}

export type StudentScheduleLesson = {
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
};

export type TutorScheduleLesson = {
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
};

export const ILessonRepository = Symbol('ILessonRepository');

export type LessonWithDetails = {
  lesson: Lesson;
  course: {
    id: string;
    title: string;
    description: string | null;
    subjectName: string | null;
    gradeName: string | null;
    level: string;
    status: string;
  };
  tutor: {
    id: string;
    email: string;
    nickname: string | null;
    avatarUrl: string | null;
  };
};

export interface ILessonRepository {
  create(lesson: Lesson): Promise<Lesson>;
  findById(id: string): Promise<Lesson | null>;
  findByCourseId(params: LessonPaginatedParams): Promise<QueryResult<Lesson>>;
  findStudentSchedule(
    params: StudentScheduleParams,
  ): Promise<StudentScheduleLesson[]>;
  findTutorSchedule(
    params: TutorScheduleParams,
  ): Promise<TutorScheduleLesson[]>;
  findByIdWithDetails(id: string): Promise<LessonWithDetails | null>;
  update(lesson: Lesson): Promise<Lesson>;
}
