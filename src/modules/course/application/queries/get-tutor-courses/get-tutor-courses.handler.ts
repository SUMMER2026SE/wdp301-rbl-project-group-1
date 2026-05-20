import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { IQuery } from '../../../../../shared/application/interfaces/use-case.interface';
import {
  createQueryResult,
  QueryResult,
} from '../../../../../shared/domain/common/query';
import { ICourseRepository } from '../../../domain/repositories/course.repository.interface';
import { GetTutorCoursesQuery } from './get-tutor-courses.query';
import { TutorCourseResultData } from './get-tutor-courses.result';

@QueryHandler(GetTutorCoursesQuery)
export class GetTutorCoursesQueryHandler
  implements
    IQueryHandler<GetTutorCoursesQuery>,
    IQuery<GetTutorCoursesQuery, QueryResult<TutorCourseResultData>>
{
  constructor(
    @Inject(ICourseRepository)
    private readonly courseRepository: ICourseRepository,
  ) {}

  async execute(
    query: GetTutorCoursesQuery,
  ): Promise<QueryResult<TutorCourseResultData>> {
    const { userId, params } = query;
    const tutorId = userId;

    const result = await this.courseRepository.findAll({
      page: params.page,
      limit: params.limit,
      skip: params.skip,
      search: params.search,
      sortBy: params.sortBy,
      sortOrder: params.sortOrder,
      gradeId: params.gradeId,
      subjectId: params.subjectId,
      status: params.status,
      tutorId,
      restrictStatus: false,
    });

    const data: TutorCourseResultData[] = result.data.map(
      ({ course: c, subject, grade }) => ({
        id: c.id,
        tutorId: c.tutorId,
        title: c.title,
        description: c.description ?? null,
        price: c.price ?? null,
        subject,
        grade,
        level: c.level.getValue(),
        status: c.status,
        createdAt: c.createdAt,
      }),
    );

    return createQueryResult(data, result.total, params);
  }
}
