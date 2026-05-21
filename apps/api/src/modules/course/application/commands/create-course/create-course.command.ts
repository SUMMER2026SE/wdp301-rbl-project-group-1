import { CourseLevelType } from '../../../domain/value-objects/course-level';

export class CreateCourseCommand {
  constructor(
    public readonly tutorId: string,
    public readonly title: string,
    public readonly description: string | undefined | null,
    public readonly price: number | undefined | null,
    public readonly subjectId: string,
    public readonly gradeId: string,
    public readonly level: CourseLevelType,
  ) {}
}
