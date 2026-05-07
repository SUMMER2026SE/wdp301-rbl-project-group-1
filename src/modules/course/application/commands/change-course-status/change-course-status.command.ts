import { CourseStatus } from '../../../../../shared/domain/enums/enums';

export class ChangeCourseStatusCommand {
  constructor(
    public readonly tutorId: string,
    public readonly courseId: string,
    public readonly status: CourseStatus,
  ) {}
}
