import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { IQuery } from '../../../../../shared/application/interfaces/use-case.interface';
import {
  createQueryResult,
  QueryResult,
} from '../../../../../shared/domain/common/query';
import { ILessonRepository } from '../../../domain/repositories/lesson.repository.interface';
import { GetLessonsByCourseQuery } from './get-lessons-by-course.query';
import { LessonByCourseResultData } from './get-lessons-by-course.result';

@QueryHandler(GetLessonsByCourseQuery)
export class GetLessonsByCourseQueryHandler
  implements
    IQueryHandler<GetLessonsByCourseQuery>,
    IQuery<GetLessonsByCourseQuery, QueryResult<LessonByCourseResultData>>
{
  constructor(
    @Inject(ILessonRepository)
    private readonly lessonRepository: ILessonRepository,
  ) {}

  async execute(
    query: GetLessonsByCourseQuery,
  ): Promise<QueryResult<LessonByCourseResultData>> {
    const { params } = query;

    const result = await this.lessonRepository.findByCourseId(params);

    const data: LessonByCourseResultData[] = result.data.map((l) => ({
      id: l.id,
      courseId: l.courseId,
      title: l.title,
      content: l.content ?? null,
      meetingUrl: l.meetingUrl ?? null,
      videoUrl: l.videoUrl ?? null,
      startTime: l.startTime,
      endTime: l.endTime ?? null,
      orderIndex: l.orderIndex,
      status: l.status,
      createdAt: l.createdAt,
    }));

    return createQueryResult(data, result.total, params);
  }
}
