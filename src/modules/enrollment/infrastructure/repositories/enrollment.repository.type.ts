import { EnrollmentStatus } from '../../../../shared/domain/enums/enums';

export type PrismaEnrollmentRecord = {
  id: string;
  studentId: string;
  courseId: string;
  status: EnrollmentStatus;
  enrolledAt: Date;
};

export type EnrollmentWriteData = Omit<
  PrismaEnrollmentRecord,
  'id' | 'enrolledAt'
> & {
  id?: string;
  enrolledAt?: Date;
};

export type EnrollmentDelegate = {
  create(args: { data: EnrollmentWriteData }): Promise<PrismaEnrollmentRecord>;
  findUnique(args: {
    where:
      | { id: string }
      | { studentId_courseId: { studentId: string; courseId: string } };
  }): Promise<PrismaEnrollmentRecord | null>;
  update(args: {
    where: { id: string };
    data: Partial<EnrollmentWriteData>;
  }): Promise<PrismaEnrollmentRecord>;
};
