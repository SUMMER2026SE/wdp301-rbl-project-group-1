import { LessonPaginatedParams } from '../../../domain/repositories/lesson.repository.interface';

export class GetLessonsByCourseQuery {
  constructor(public readonly params: LessonPaginatedParams) {}
}
