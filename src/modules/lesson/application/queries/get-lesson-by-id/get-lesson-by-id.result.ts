import { LessonStatus } from '../../../../../shared/domain/enums/enums';

export class LessonDto {
  constructor(
    public readonly id: string,
    public readonly courseId: string,
    public readonly title: string,
    public readonly content: string | null,
    public readonly meetingUrl: string | null,
    public readonly videoUrl: string | null,
    public readonly startTime: Date,
    public readonly endTime: Date | null,
    public readonly orderIndex: number,
    public readonly status: LessonStatus,
    public readonly createdAt: Date,
  ) {}
}

export class GetLessonByIdResult {
  constructor(public readonly lesson: LessonDto) {}
}
