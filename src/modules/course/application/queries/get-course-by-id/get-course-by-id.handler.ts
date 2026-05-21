import { Inject, NotFoundException } from '@nestjs/common';
import { EventBus, IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { IQuery } from '../../../../../shared/application/interfaces/use-case.interface';
import { CourseViewedDomainEvent } from '../../../domain/events/course-viewed.domain-event';
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
    private readonly eventBus: EventBus,
  ) {}

  async execute(query: GetCourseByIdQuery): Promise<GetCourseByIdResult> {
    const result = await this.courseRepository.findByIdWithMeta(query.id);
    if (!result) {
      throw new NotFoundException(`Course with id ${query.id} not found`);
    }

    const { course, subject, grade } = result;

    if (query.userId) {
      this.eventBus.publish(
        new CourseViewedDomainEvent(query.userId, course.id),
      );
    }

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
