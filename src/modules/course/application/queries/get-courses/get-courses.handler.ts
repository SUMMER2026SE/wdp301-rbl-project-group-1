import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import {
  createQueryResult,
  QueryResult,
} from '../../../../../shared/domain/common/query';
import { IQuery } from '../../../../../shared/application/interfaces/use-case.interface';
import { ICourseRepository } from '../../../domain/repositories/course.repository.interface';
import { GetCoursesQuery } from './get-courses.query';
import { CourseResultData } from './get-courses.result';

@QueryHandler(GetCoursesQuery)
export class GetCoursesQueryHandler
  implements
    IQueryHandler<GetCoursesQuery>,
    IQuery<GetCoursesQuery, QueryResult<CourseResultData>>
{
  constructor(
    @Inject(ICourseRepository)
    private readonly courseRepository: ICourseRepository,
  ) {}

  async execute(
    query: GetCoursesQuery,
  ): Promise<QueryResult<CourseResultData>> {
    const { params } = query;

    const result = await this.courseRepository.findAll({
      page: params.page,
      limit: params.limit,
      skip: params.skip,
      search: params.search,
      sortBy: params.sortBy,
      sortOrder: params.sortOrder,
      gradeId: params.gradeId,
      subjectId: params.subjectId,
    });

    const data: CourseResultData[] = result.data.map(
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
