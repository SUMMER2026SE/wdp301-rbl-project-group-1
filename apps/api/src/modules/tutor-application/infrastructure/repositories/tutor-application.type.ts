import { Prisma } from '../../../../../generated/prisma/client';
import { TutorApplicationStatus } from '../../domain/enums/tutor-application';

export type PrismaSubjectRecord = {
  id: string;
  name: string;
  slug: string;
  createdAt: Date;
};

export type PrismaGradeRecord = {
  id: string;
  name: string;
  slug: string;
  order: number;
  createdAt: Date;
};

export type PrismaTutorApplicationSubjectRecord = {
  tutorApplicationId: string;
  subjectId: string;
  subject: PrismaSubjectRecord;
};

export type PrismaTutorApplicationGradeRecord = {
  tutorApplicationId: string;
  gradeId: string;
  grade: PrismaGradeRecord;
};

export type PrismaTutorApplicationRecord = {
  id: string;
  email: string;
  userId: string | null;
  bio: string | null;
  specialization: string;
  experience: number | null;
  education: string | null;
  pricePerHour: number | null;
  avatarUrl: string | null;
  files: string[];
  status: TutorApplicationStatus;
  createdAt: Date;
  updatedAt: Date;
  subjects?: PrismaTutorApplicationSubjectRecord[];
  grades?: PrismaTutorApplicationGradeRecord[];
};

export type TutorApplicationWriteData = Omit<
  PrismaTutorApplicationRecord,
  'createdAt' | 'updatedAt' | 'id' | 'subjects' | 'grades'
> & {
  id?: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export type TutorApplicationDelegate = {
  findUnique(args: {
    where: { id?: string; email?: string; userId?: string };
    include?: Prisma.TutorApplicationInclude;
  }): Promise<PrismaTutorApplicationRecord | null>;
  create(args: {
    data:
      | Prisma.TutorApplicationCreateInput
      | Prisma.TutorApplicationUncheckedCreateInput;
    include?: Prisma.TutorApplicationInclude;
  }): Promise<PrismaTutorApplicationRecord>;
  update(args: {
    where: { id: string };
    data:
      | Prisma.TutorApplicationUpdateInput
      | Prisma.TutorApplicationUncheckedUpdateInput;
    include?: Prisma.TutorApplicationInclude;
  }): Promise<PrismaTutorApplicationRecord>;
  findMany(args: {
    where?: Prisma.TutorApplicationWhereInput;
    skip?: number;
    take?: number;
    orderBy?: Prisma.TutorApplicationOrderByWithRelationInput;
    include?: Prisma.TutorApplicationInclude;
  }): Promise<PrismaTutorApplicationRecord[]>;
  count(args: { where?: Prisma.TutorApplicationWhereInput }): Promise<number>;
};
