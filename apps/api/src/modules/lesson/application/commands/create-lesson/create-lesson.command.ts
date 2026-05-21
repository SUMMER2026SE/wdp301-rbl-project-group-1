import { LessonStatus } from '../../../../../shared/domain/enums/enums';

export class CreateLessonCommand {
  constructor(
    public readonly tutorId: string,
    public readonly courseId: string,
    public readonly title: string,
    public readonly startTime: Date,
    public readonly endTime: Date,
    public readonly orderIndex: number,
    public readonly status: LessonStatus,
    public readonly content?: string,
    public readonly meetingUrl?: string,
    public readonly videoUrl?: string,
  ) {}
}
