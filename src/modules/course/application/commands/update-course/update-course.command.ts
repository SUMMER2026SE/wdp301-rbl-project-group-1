import { CourseLevelType } from '../../../domain/value-objects/course-level';

export class UpdateCourseCommand {
  constructor(
    public readonly tutorId: string,
    public readonly courseId: string,
    public readonly title?: string,
    public readonly description?: string | null,
    public readonly price?: number | null,
    public readonly subjectId?: string,
    public readonly gradeId?: string,
    public readonly level?: CourseLevelType,
  ) {}
}
