import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { IQuery } from '../../../../../shared/application/interfaces/use-case.interface';
import { ICourseRepository } from '../../../domain/repositories/course.repository.interface';
import { CourseDto } from '../../../presentation/schemas/course-response.dto';
import { GetCoursesQuery } from './get-courses.query';
import { GetCoursesResult } from './get-courses.result';

@QueryHandler(GetCoursesQuery)
export class GetCoursesQueryHandler
  implements
    IQueryHandler<GetCoursesQuery>,
    IQuery<GetCoursesQuery, GetCoursesResult>
{
  constructor(
    @Inject(ICourseRepository)
    private readonly courseRepository: ICourseRepository,
  ) {}

  async execute() // _: GetCoursesQuery
  : Promise<GetCoursesResult> {
    const courses = await this.courseRepository.findAll();

    const dtos = courses.map(
      (c) =>
        ({
          id: c.id,
          tutorId: c.tutorId,
          title: c.title,
          description: c.description,
          price: c.price,
          subjectId: c.subjectId,
          gradeId: c.gradeId,
          level: c.level.getValue(),
          status: c.status,
          createdAt: c.createdAt,
        }) as CourseDto,
    );

    return new GetCoursesResult(dtos);
  }
}
