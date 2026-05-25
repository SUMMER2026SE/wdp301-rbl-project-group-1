import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { IQuery } from '../../../../../shared/application/interfaces/use-case.interface';
import { ILessonRepository } from '../../../domain/repositories/lesson.repository.interface';
import { GetStudentScheduleQuery } from './get-student-schedule.query';
import { StudentScheduleResultData } from './get-student-schedule.result';

@QueryHandler(GetStudentScheduleQuery)
export class GetStudentScheduleQueryHandler
  implements
    IQueryHandler<GetStudentScheduleQuery>,
    IQuery<GetStudentScheduleQuery, StudentScheduleResultData[]>
{
  constructor(
    @Inject(ILessonRepository)
    private readonly lessonRepository: ILessonRepository,
  ) {}

  async execute(
    query: GetStudentScheduleQuery,
  ): Promise<StudentScheduleResultData[]> {
    const { params } = query;
    const lessons = await this.lessonRepository.findStudentSchedule(params);

    return lessons.map((l) => ({
      id: l.id,
      courseId: l.courseId,
      courseTitle: l.courseTitle,
      tutorNickname: l.tutorNickname,
      tutorAvatarUrl: l.tutorAvatarUrl,
      title: l.title,
      meetingUrl: l.meetingUrl,
      videoUrl: l.videoUrl,
      startTime: l.startTime,
      endTime: l.endTime,
      status: l.status,
      attendance: l.attendance,
    }));
  }
}
