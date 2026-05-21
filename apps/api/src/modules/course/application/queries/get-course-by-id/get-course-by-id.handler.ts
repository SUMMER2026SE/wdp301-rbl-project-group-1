import { Inject, NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { IQuery } from '../../../../../shared/application/interfaces/use-case.interface';
import { ICourseRepository } from '../../../domain/repositories/course.repository.interface';
import { GetCourseByIdQuery } from './get-course-by-id.query';
import { GetCourseByIdResult } from './get-course-by-id.result';

@QueryHandler(GetCourseByIdQuery)
export class GetCourseByIdQueryHandler
  implements
    IQueryHandler<GetCourseByIdQuery>,
    IQuery<GetCourseByIdQuery, GetCourseByIdResult>
{
  constructor(
    @Inject(ICourseRepository)
    private readonly courseRepository: ICourseRepository,
  ) {}

  async execute(query: GetCourseByIdQuery): Promise<GetCourseByIdResult> {
    const result = await this.courseRepository.findByIdWithMeta(query.id);
    if (!result) {
      throw new NotFoundException(`Course with id ${query.id} not found`);
    }

    const { course, subject, grade } = result;

    return new GetCourseByIdResult(
      course.id,
      course.tutorId,
      course.title,
      course.description ?? null,
      course.price ?? null,
      subject,
      grade,
      course.level.getValue(),
      course.status,
      course.createdAt,
    );
  }
}
