import { CourseDto } from '../../../presentation/schemas/course-response.dto';

export class GetCoursesResult {
  constructor(public readonly courses: CourseDto[]) {}
}
