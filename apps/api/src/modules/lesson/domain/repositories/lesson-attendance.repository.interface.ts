import { LessonAttendance } from '../entities/lesson-attendance.entity';

export const ILessonAttendanceRepository = Symbol(
  'ILessonAttendanceRepository',
);

export interface ILessonAttendanceRepository {
  upsert(attendance: LessonAttendance): Promise<LessonAttendance>;
  upsertMany(attendances: LessonAttendance[]): Promise<LessonAttendance[]>;
  findByLessonId(lessonId: string): Promise<LessonAttendance[]>;
  findByLessonAndStudent(
    lessonId: string,
    studentId: string,
  ): Promise<LessonAttendance | null>;
}
