import {
  QueryParams,
  QueryResult,
} from '../../../../shared/domain/common/query';
import { Lesson } from '../entities/lesson.entity';

export interface LessonPaginatedParams extends QueryParams {
  courseId: string;
}

export const ILessonRepository = Symbol('ILessonRepository');

export interface ILessonRepository {
  create(lesson: Lesson): Promise<Lesson>;
  findById(id: string): Promise<Lesson | null>;
  findByCourseId(
    params: LessonPaginatedParams,
  ): Promise<QueryResult<Lesson>>;
}
