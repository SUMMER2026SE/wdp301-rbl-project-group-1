import { AttendanceStatus } from '../../../../shared/domain/enums/enums';

export type PrismaLessonAttendanceRecord = {
  id: string;
  lessonId: string | null;
  studentId: string;
  status: AttendanceStatus;
  note: string | null;
  markedAt: Date;
  updatedAt: Date;
};

export type LessonAttendanceWriteData = {
  id?: string;
  lessonId: string;
  studentId: string;
  status: AttendanceStatus;
  note?: string | null;
  markedAt?: Date;
  updatedAt?: Date;
};

export type LessonAttendanceDelegate = {
  findMany(args: {
    where: Record<string, unknown>;
    orderBy?: Record<string, 'asc' | 'desc'>;
  }): Promise<PrismaLessonAttendanceRecord[]>;
  findUnique(args: {
    where: Record<string, unknown>;
  }): Promise<PrismaLessonAttendanceRecord | null>;
  upsert(args: {
    where: Record<string, unknown>;
    create: LessonAttendanceWriteData;
    update: Partial<LessonAttendanceWriteData>;
  }): Promise<PrismaLessonAttendanceRecord>;
};
