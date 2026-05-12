import { Prisma } from '../../../../../generated/prisma/client';
import { TutorApplicationStatus } from '../../domain/enums/tutor-application';

export type PrismaTutorApplicationRecord = {
  id: string;
  email: string;
  userId: string | null;
  bio: string | null;
  specialization: string;
  experience: number | null;
  education: string | null;
  pricePerHour: number | null;
  status: TutorApplicationStatus;
  createdAt: Date;
  updatedAt: Date;
};

export type TutorApplicationWriteData = Omit<
  PrismaTutorApplicationRecord,
  'createdAt' | 'updatedAt' | 'id'
> & {
  id?: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export type TutorApplicationDelegate = {
  findUnique(args: {
    where: { id?: string; email?: string; userId?: string };
  }): Promise<PrismaTutorApplicationRecord | null>;
  create(args: {
    data: TutorApplicationWriteData;
  }): Promise<PrismaTutorApplicationRecord>;
  update(args: {
    where: { id: string };
    data: Partial<TutorApplicationWriteData>;
  }): Promise<PrismaTutorApplicationRecord>;
  findMany(args: {
    where?: Prisma.TutorApplicationWhereInput;
    skip?: number;
    take?: number;
    orderBy?: Prisma.TutorApplicationOrderByWithRelationInput;
  }): Promise<PrismaTutorApplicationRecord[]>;
  count(args: { where?: Prisma.TutorApplicationWhereInput }): Promise<number>;
};
