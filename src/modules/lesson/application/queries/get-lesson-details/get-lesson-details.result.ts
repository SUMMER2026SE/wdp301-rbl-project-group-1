export class LessonCourseDto {
  constructor(
    public readonly id: string,
    public readonly title: string,
    public readonly description: string | null,
    public readonly subjectName: string | null,
    public readonly gradeName: string | null,
    public readonly level: string,
    public readonly status: string,
  ) {}
}

export class LessonTutorDto {
  constructor(
    public readonly id: string,
    public readonly email: string,
    public readonly nickname: string | null,
    public readonly avatarUrl: string | null,
  ) {}
}

export class GetLessonDetailsResult {
  constructor(
    public readonly id: string,
    public readonly title: string,
    public readonly content: string | null,
    public readonly meetingUrl: string | null,
    public readonly videoUrl: string | null,
    public readonly startTime: Date,
    public readonly endTime: Date | null,
    public readonly orderIndex: number,
    public readonly status: string,
    public readonly createdAt: Date,
    public readonly course: LessonCourseDto,
    public readonly tutor: LessonTutorDto,
  ) {}
}
