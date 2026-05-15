import { LessonStatus } from '../../../../shared/domain/enums/enums';

export type PrismaLessonRecord = {
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
};

export type LessonWriteData = Omit<PrismaLessonRecord, 'createdAt' | 'id'> & {
  id?: string;
  createdAt?: Date;
};

export type LessonDelegate = {
  findUnique(args: {
    where: { id: string };
  }): Promise<PrismaLessonRecord | null>;
  findMany(args: {
    where: Record<string, unknown>;
    orderBy?: Record<string, 'asc' | 'desc'>;
    skip?: number;
    take?: number;
  }): Promise<PrismaLessonRecord[]>;
  count(args: { where: Record<string, unknown> }): Promise<number>;
  create(args: { data: LessonWriteData }): Promise<PrismaLessonRecord>;
};
