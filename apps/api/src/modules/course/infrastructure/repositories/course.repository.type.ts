import { CourseStatus } from '../../../../shared/domain/enums/enums';
import { EnrollmentStatus } from '../../../../shared/domain/enums/enums';
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
  subject?: { id: string; name: string } | null;
  grade?: { id: string; name: string } | null;
  tutor?: {
    user?: {
      profile?: {
        nickname: string;
        avatarUrl: string | null;
      } | null;
    } | null;
  } | null;
};

export type CourseWriteData = Omit<
  PrismaCourseRecord,
  'createdAt' | 'id' | 'subject' | 'grade' | 'tutor'
> & {
  id?: string;
  createdAt?: Date;
};

export type CourseDelegate = {
  findUnique(args: {
    where: { id: string };
    include?: any;
  }): Promise<PrismaCourseRecord | null>;
  create(args: { data: CourseWriteData }): Promise<PrismaCourseRecord>;
  update(args: {
    where: { id: string };
    data: Partial<CourseWriteData>;
  }): Promise<PrismaCourseRecord>;
  count(args?: { where?: Record<string, unknown> }): Promise<number>;
  findMany(args?: {
    where?: Record<string, unknown>;
    orderBy?: Record<string, 'asc' | 'desc'>;
    skip?: number;
    take?: number;
    include?: any;
  }): Promise<PrismaCourseRecord[]>;
};

export type EnrollmentWithStudentRecord = {
  courseId: string;
  studentId: string;
  status: EnrollmentStatus;
  enrolledAt: Date;
  student?: {
    id: string;
    school: string | null;
    learningGoal: string | null;
    user: {
      email: string;
      profile: {
        nickname: string;
        avatarUrl: string | null;
      } | null;
    };
  };
};

export type EnrollmentDelegate = {
  findMany(args?: {
    where?: Record<string, unknown>;
    include?: any;
    select?: any;
  }): Promise<EnrollmentWithStudentRecord[]>;
};
