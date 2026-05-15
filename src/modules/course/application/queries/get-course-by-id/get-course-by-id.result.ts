import { CourseStatus } from '../../../../../shared/domain/enums/enums';
import { CourseLevelType } from '../../../domain/value-objects/course-level';

export class GetCourseByIdResult {
  constructor(
    public readonly id: string,
    public readonly tutorId: string,
    public readonly title: string,
    public readonly description: string | null,
    public readonly price: number | null,
    public readonly subject: { id: string; name: string | null },
    public readonly grade: { id: string; name: string | null },
    public readonly level: CourseLevelType,
    public readonly status: CourseStatus,
    public readonly createdAt: Date,
  ) {}
}
