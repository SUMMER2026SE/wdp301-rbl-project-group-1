import { CourseStatus } from '../../../../shared/domain/enums/enums';
import { CourseLevelType } from '../../domain/value-objects/course-level';

export type PrismaCourseRecord = {
  id: string;
  tutorId: string;
  title: string;
  description: string | null;
  price: number | null;
  subjectId: string;
  gradeId: string;
  level: CourseLevelType;
  status: CourseStatus;
  createdAt: Date;
};

export type CourseWriteData = Omit<PrismaCourseRecord, 'createdAt' | 'id'> & {
  id?: string;
  createdAt?: Date;
};

export type CourseDelegate = {
  findUnique(args: {
    where: { id: string };
  }): Promise<PrismaCourseRecord | null>;
  create(args: { data: CourseWriteData }): Promise<PrismaCourseRecord>;
  update(args: {
    where: { id: string };
    data: Partial<CourseWriteData>;
  }): Promise<PrismaCourseRecord>;
  findMany(args?: {
    where?: Record<string, unknown>;
    orderBy?: Record<string, 'asc' | 'desc'>;
  }): Promise<PrismaCourseRecord[]>;
};
