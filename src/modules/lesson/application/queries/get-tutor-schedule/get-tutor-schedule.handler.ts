import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { IQuery } from '../../../../../shared/application/interfaces/use-case.interface';
import { ILessonRepository } from '../../../domain/repositories/lesson.repository.interface';
import { GetTutorScheduleQuery } from './get-tutor-schedule.query';
import { TutorScheduleResultData } from './get-tutor-schedule.result';

@QueryHandler(GetTutorScheduleQuery)
export class GetTutorScheduleQueryHandler
  implements
    IQueryHandler<GetTutorScheduleQuery>,
    IQuery<GetTutorScheduleQuery, TutorScheduleResultData[]>
{
  constructor(
    @Inject(ILessonRepository)
    private readonly lessonRepository: ILessonRepository,
  ) {}

  async execute(
    query: GetTutorScheduleQuery,
  ): Promise<TutorScheduleResultData[]> {
    const { params } = query;
    const lessons = await this.lessonRepository.findTutorSchedule(params);

    return lessons.map((l) => ({
      id: l.id,
      courseId: l.courseId,
      courseTitle: l.courseTitle,
      title: l.title,
      meetingUrl: l.meetingUrl,
      videoUrl: l.videoUrl,
      startTime: l.startTime,
      endTime: l.endTime,
      status: l.status,
      enrolledStudentCount: l.enrolledStudentCount,
      attendanceMarked: l.attendanceMarked,
    }));
  }
}
