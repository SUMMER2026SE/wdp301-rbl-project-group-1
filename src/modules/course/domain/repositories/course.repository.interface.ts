import { CourseStatus } from 'src/shared/domain/enums/enums';
import {
  QueryParams,
  QueryResult,
} from '../../../../shared/domain/common/query';
import { type Course } from '../entities/course.entity';

export interface CoursePaginatedParams extends QueryParams {
  gradeId?: string;
  subjectId?: string;
  status?: CourseStatus;
}

export const ICourseRepository = Symbol('ICourseRepository');

export interface CourseWithMeta {
  course: Course;
  subject: { id: string; name: string | null };
  grade: { id: string; name: string | null };
}

export interface ICourseRepository {
  create(course: Course): Promise<Course>;
  findById(id: string): Promise<Course | null>;
  findAll(params: CoursePaginatedParams): Promise<QueryResult<CourseWithMeta>>;
  update(course: Course): Promise<Course>;
}
