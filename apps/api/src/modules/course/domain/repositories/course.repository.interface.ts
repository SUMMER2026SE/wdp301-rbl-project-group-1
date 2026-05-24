import { CourseStatus } from 'src/shared/domain/enums/enums';
import { EnrollmentStatus } from '../../../../shared/domain/enums/enums';
import {
  QueryParams,
  QueryResult,
} from '../../../../shared/domain/common/query';
import { type Course } from '../entities/course.entity';

export interface CoursePaginatedParams extends QueryParams {
  gradeIds?: string[];
  subjectIds?: string[];
  status?: CourseStatus;
  tutorId?: string;
  restrictStatus?: boolean;
  minPrice?: number;
  maxPrice?: number;
  studentId?: string;
}

export const ICourseRepository = Symbol('ICourseRepository');

export interface CourseWithMeta {
  course: Course;
  subject: { id: string; name: string | null };
  grade: { id: string; name: string | null };
  tutor: {
    id: string;
    name: string | null;
    avatarUrl: string | null;
  };
  isEnrolled?: boolean;
}

export interface JoinedStudent {
  studentId: string;
  email: string;
  nickname: string | null;
  avatarUrl: string | null;
  school: string | null;
  learningGoal: string | null;
  status: EnrollmentStatus;
  enrolledAt: Date;
}

export interface ICourseRepository {
  create(course: Course): Promise<Course>;
  findById(id: string): Promise<Course | null>;
  findByIdWithMeta(id: string): Promise<CourseWithMeta | null>;
  findAll(params: CoursePaginatedParams): Promise<QueryResult<CourseWithMeta>>;
  update(course: Course): Promise<Course>;
  findJoinedStudents(courseId: string): Promise<JoinedStudent[]>;
}
