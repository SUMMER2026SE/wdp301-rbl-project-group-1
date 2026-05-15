import {
  QueryParams,
  QueryResult,
} from '../../../../shared/domain/common/query';
import { Lesson } from '../entities/lesson.entity';

export interface LessonPaginatedParams extends QueryParams {
  courseId: string;
}

export const ILessonRepository = Symbol('ILessonRepository');

export type LessonWithDetails = {
  lesson: Lesson;
  course: {
    id: string;
    title: string;
    description: string | null;
    subjectName: string | null;
    gradeName: string | null;
    level: string;
    status: string;
  };
  tutor: {
    id: string;
    email: string;
    nickname: string | null;
    avatarUrl: string | null;
  };
};

export interface ILessonRepository {
  create(lesson: Lesson): Promise<Lesson>;
  findById(id: string): Promise<Lesson | null>;
  findByCourseId(
    params: LessonPaginatedParams,
  ): Promise<QueryResult<Lesson>>;
  findByIdWithDetails(id: string): Promise<LessonWithDetails | null>;
  update(lesson: Lesson): Promise<Lesson>;
}
