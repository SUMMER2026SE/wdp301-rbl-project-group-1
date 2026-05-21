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

export type PrismaLessonWithDetailsRecord = PrismaLessonRecord & {
  course: {
    id: string;
    title: string;
    description: string | null;
    level: string;
    status: string;
    tutorId: string;
    subject: { name: string } | null;
    grade: { name: string } | null;
    tutor: {
      user: {
        id: string;
        email: string;
        profile: { nickname: string; avatarUrl: string | null } | null;
      };
    };
  };
};

export type LessonWriteData = Omit<PrismaLessonRecord, 'createdAt' | 'id'> & {
  id?: string;
  createdAt?: Date;
};

export type LessonDelegate = {
  findUnique(args: {
    where: { id: string };
  }): Promise<PrismaLessonRecord | null>;
  findUnique(args: {
    where: { id: string };
    include: {
      course: {
        include: {
          subject: boolean;
          grade: boolean;
          tutor: { include: { user: { include: { profile: boolean } } } };
        };
      };
    };
  }): Promise<PrismaLessonWithDetailsRecord | null>;
  findMany(args: {
    where: Record<string, unknown>;
    orderBy?: Record<string, 'asc' | 'desc'>;
    skip?: number;
    take?: number;
  }): Promise<PrismaLessonRecord[]>;
  count(args: { where: Record<string, unknown> }): Promise<number>;
  create(args: { data: LessonWriteData }): Promise<PrismaLessonRecord>;
  update(args: {
    where: { id: string };
    data: Partial<LessonWriteData>;
  }): Promise<PrismaLessonRecord>;
};
