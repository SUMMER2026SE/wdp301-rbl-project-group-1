import { CoursePaginatedParams } from 'src/modules/course/domain/repositories/course.repository.interface';

export class GetCoursesQuery {
  constructor(public readonly params: CoursePaginatedParams) {}
}
