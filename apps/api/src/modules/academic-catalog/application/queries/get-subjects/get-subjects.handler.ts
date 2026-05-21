import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { IQuery } from '../../../../../shared/application/interfaces/use-case.interface';
import { ISubjectRepository } from '../../../domain/repositories/subject.repository.interface';
import { GetSubjectsQuery } from './get-subjects.query';
import { GetSubjectsResult, SubjectDto } from './get-subjects.result';

@QueryHandler(GetSubjectsQuery)
export class GetSubjectsQueryHandler
  implements
    IQueryHandler<GetSubjectsQuery>,
    IQuery<GetSubjectsQuery, GetSubjectsResult>
{
  constructor(
    @Inject(ISubjectRepository)
    private readonly subjectRepository: ISubjectRepository,
  ) {}

  async execute(): Promise<GetSubjectsResult> {
    const subjects = await this.subjectRepository.findAll();

    const dtos = subjects.map(
      (subject) =>
        new SubjectDto(
          subject.id,
          subject.name,
          subject.slug,
          subject.createdAt,
        ),
    );

    return new GetSubjectsResult(dtos);
  }
}
