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

  async execute() // _: GetGradesQuery
  : Promise<GetGradesResult> {
    const grades = await this.gradeRepository.findAll();

    const dtos = grades.map(
      (g) => new GradeDto(g.id, g.name, g.slug, g.order, g.createdAt),
    );

    return new GetGradesResult(dtos);
  }
}
