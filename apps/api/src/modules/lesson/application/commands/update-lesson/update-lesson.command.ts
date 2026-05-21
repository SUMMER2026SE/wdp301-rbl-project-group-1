import { LessonStatus } from '../../../../../shared/domain/enums/enums';

export class UpdateLessonCommand {
  constructor(
    public readonly lessonId: string,
    public readonly title?: string,
    public readonly content?: string | null,
    public readonly meetingUrl?: string | null,
    public readonly videoUrl?: string | null,
    public readonly startTime?: Date,
    public readonly endTime?: Date | null,
    public readonly orderIndex?: number,
    public readonly status?: LessonStatus,
  ) {}
}
