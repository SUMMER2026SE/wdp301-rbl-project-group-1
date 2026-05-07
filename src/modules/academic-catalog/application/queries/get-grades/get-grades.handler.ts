import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { IQuery } from '../../../../../shared/application/interfaces/use-case.interface';
import { IGradeRepository } from '../../../domain/repositories/grade.repository.interface';
import { GetGradesQuery } from './get-grades.query';
import { GetGradesResult, GradeDto } from './get-grades.result';

@QueryHandler(GetGradesQuery)
export class GetGradesQueryHandler
  implements
    IQueryHandler<GetGradesQuery>,
    IQuery<GetGradesQuery, GetGradesResult>
{
  constructor(
    @Inject(IGradeRepository)
    private readonly gradeRepository: IGradeRepository,
  ) {}

  async execute(): Promise<GetGradesResult> {
    const grades = await this.gradeRepository.findAll();

    const dtos = grades.map(
      (grade) =>
        new GradeDto(
          grade.id,
          grade.name,
          grade.slug,
          grade.order,
          grade.createdAt,
        ),
    );

    return new GetGradesResult(dtos);
  }
}
