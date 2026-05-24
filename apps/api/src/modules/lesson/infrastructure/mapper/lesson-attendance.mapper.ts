import { IMapper } from '../../../../shared/application/interfaces/mapper.interface';
import { LessonAttendance } from '../../domain/entities/lesson-attendance.entity';
import {
  LessonAttendanceWriteData,
  PrismaLessonAttendanceRecord,
} from '../repositories/lesson-attendance.repository.type';

export class LessonAttendanceMapper implements IMapper<
  LessonAttendance,
  PrismaLessonAttendanceRecord | LessonAttendanceWriteData
> {
  toDomain(record: PrismaLessonAttendanceRecord): LessonAttendance {
    return LessonAttendance.create(record.id, {
      lessonId: record.lessonId ?? '',
      studentId: record.studentId,
      status: record.status,
      note: record.note,
      markedAt: record.markedAt,
      updatedAt: record.updatedAt,
    });
  }

  toPersistence(attendance: LessonAttendance): LessonAttendanceWriteData {
    return {
      ...(attendance.id && { id: attendance.id }),
      lessonId: attendance.lessonId,
      studentId: attendance.studentId,
      status: attendance.status,
      note: attendance.note ?? null,
    };
  }
}
