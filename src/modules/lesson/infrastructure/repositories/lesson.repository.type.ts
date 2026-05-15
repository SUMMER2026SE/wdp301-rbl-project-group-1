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
  findMany(): Promise<PrismaLessonRecord[]>;
  create(args: { data: LessonWriteData }): Promise<PrismaLessonRecord>;
};
