import { Inject, NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { IQuery } from '../../../../../shared/application/interfaces/use-case.interface';
import { ITutorRequestRepository } from '../../../domain/repositories/tutor-request.repository.interface';
import { GetTutorRequestQuery } from './get-tutor-request.query';
import { GetTutorRequestResult } from './get-tutor-request.result';

@QueryHandler(GetTutorRequestQuery)
export class GetTutorRequestQueryHandler
  implements
    IQueryHandler<GetTutorRequestQuery>,
    IQuery<GetTutorRequestQuery, GetTutorRequestResult>
{
  constructor(
    @Inject(ITutorRequestRepository)
    private readonly tutorRequestRepository: ITutorRequestRepository,
  ) {}

  async execute(query: GetTutorRequestQuery): Promise<GetTutorRequestResult> {
    const request = await this.tutorRequestRepository.findById(query.id);
    if (!request) {
      throw new NotFoundException(
        `Tutor request with id ${query.id} not found`,
      );
    }

    return new GetTutorRequestResult(
      request.id,
      request.studentId,
      request.subjectId,
      request.title,
      request.description,
      request.mode,
      request.budget,
      request.status,
      request.createdAt,
    );
  }
}
