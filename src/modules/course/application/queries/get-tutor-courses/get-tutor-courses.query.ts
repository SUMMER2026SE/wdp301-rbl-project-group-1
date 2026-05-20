import { CoursePaginatedParams } from 'src/modules/course/domain/repositories/course.repository.interface';

export class GetTutorCoursesQuery {
  constructor(
    public readonly userId: string,
    public readonly params: CoursePaginatedParams,
  ) {}
}
