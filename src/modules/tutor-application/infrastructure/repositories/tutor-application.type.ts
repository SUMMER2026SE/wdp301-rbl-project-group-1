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
    where: { email?: string; userId?: string };
  }): Promise<PrismaTutorApplicationRecord | null>;
  create(args: {
    data: TutorApplicationWriteData;
  }): Promise<PrismaTutorApplicationRecord>;
};
