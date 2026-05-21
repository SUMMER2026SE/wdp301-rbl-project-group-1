import { Inject, NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { IQuery } from '../../../../../shared/application/interfaces/use-case.interface';
import { ILessonRepository } from '../../../domain/repositories/lesson.repository.interface';
import { GetLessonByIdQuery } from './get-lesson-by-id.query';
import { GetLessonByIdResult, LessonDto } from './get-lesson-by-id.result';

@QueryHandler(GetLessonByIdQuery)
export class GetLessonByIdQueryHandler
  implements
    IQueryHandler<GetLessonByIdQuery>,
    IQuery<GetLessonByIdQuery, GetLessonByIdResult>
{
  constructor(
    @Inject(ILessonRepository)
    private readonly lessonRepository: ILessonRepository,
  ) {}

  async execute(query: GetLessonByIdQuery): Promise<GetLessonByIdResult> {
    const lesson = await this.lessonRepository.findById(query.id);
    if (!lesson) {
      throw new NotFoundException(`Lesson with id ${query.id} not found`);
    }

    return new GetLessonByIdResult(
      new LessonDto(
        lesson.id,
        lesson.courseId,
        lesson.title,
        lesson.content ?? null,
        lesson.meetingUrl ?? null,
        lesson.videoUrl ?? null,
        lesson.startTime,
        lesson.endTime ?? null,
        lesson.orderIndex,
        lesson.status,
        lesson.createdAt,
      ),
    );
  }
}
