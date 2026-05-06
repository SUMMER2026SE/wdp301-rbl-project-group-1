import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { TutorApplicationRepository } from '../../../domain/repositories/tutor-application.repository';
import { GetTutorApplicationQuery } from './get-tutor-application.query';
import { GetTutorApplicationResult } from './get-tutor-application.result';

@QueryHandler(GetTutorApplicationQuery)
export class GetTutorApplicationHandler implements IQueryHandler<
  GetTutorApplicationQuery,
  GetTutorApplicationResult
> {
  constructor(
    private readonly tutorApplicationRepository: TutorApplicationRepository,
  ) {}

  async execute(
    query: GetTutorApplicationQuery,
  ): Promise<GetTutorApplicationResult> {
    const result = await this.tutorApplicationRepository.findAll(query.query);
    return new GetTutorApplicationResult(result);
  }
}
