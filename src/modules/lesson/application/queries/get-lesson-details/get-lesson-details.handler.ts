import { Inject, NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { IQuery } from '../../../../../shared/application/interfaces/use-case.interface';
import { ILessonRepository } from '../../../domain/repositories/lesson.repository.interface';
import { GetLessonDetailsQuery } from './get-lesson-details.query';
import {
  GetLessonDetailsResult,
  LessonCourseDto,
  LessonTutorDto,
} from './get-lesson-details.result';

@QueryHandler(GetLessonDetailsQuery)
export class GetLessonDetailsQueryHandler
  implements
    IQueryHandler<GetLessonDetailsQuery>,
    IQuery<GetLessonDetailsQuery, GetLessonDetailsResult>
{
  constructor(
    @Inject(ILessonRepository)
    private readonly lessonRepository: ILessonRepository,
  ) {}

  async execute(
    query: GetLessonDetailsQuery,
  ): Promise<GetLessonDetailsResult> {
    const data = await this.lessonRepository.findByIdWithDetails(
      query.lessonId,
    );

    if (!data) {
      throw new NotFoundException(
        `Lesson with id ${query.lessonId} not found`,
      );
    }

    const { lesson, course, tutor } = data;

    return new GetLessonDetailsResult(
      lesson.id,
      lesson.title,
      lesson.content ?? null,
      lesson.meetingUrl ?? null,
      lesson.videoUrl ?? null,
      lesson.startTime,
      lesson.endTime ?? null,
      lesson.orderIndex,
      lesson.status,
      lesson.createdAt,
      new LessonCourseDto(
        course.id,
        course.title,
        course.description,
        course.subjectName,
        course.gradeName,
        course.level,
        course.status,
      ),
      new LessonTutorDto(
        tutor.id,
        tutor.email,
        tutor.nickname,
        tutor.avatarUrl,
      ),
    );
  }
}
