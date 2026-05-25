import { ForbiddenException, Inject, NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import {
  AttemptWithQuestionsAndAnswers,
  IAttemptRepository,
} from '../../../domain/repositories/attempt.repository.interface';
import { GetAttemptResultQuery } from './get-attempt-result.query';

@QueryHandler(GetAttemptResultQuery)
export class GetAttemptResultQueryHandler implements IQueryHandler<GetAttemptResultQuery> {
  constructor(
    @Inject(IAttemptRepository)
    private readonly attemptRepository: IAttemptRepository,
  ) {}

  async execute(
    query: GetAttemptResultQuery,
  ): Promise<AttemptWithQuestionsAndAnswers> {
    const result = await this.attemptRepository.findByIdWithAnswers(
      query.attemptId,
    );
    if (!result) {
      throw new NotFoundException(`Attempt ${query.attemptId} not found`);
    }
    if (result.attempt.studentId !== query.studentId) {
      throw new ForbiddenException('You do not own this attempt');
    }
    return result;
  }
}
