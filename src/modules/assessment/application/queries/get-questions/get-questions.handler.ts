import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { QueryResult } from '../../../../../shared/domain/common/query';
import { Question } from '../../../domain/entities/question.entity';
import { IQuestionBankRepository } from '../../../domain/repositories/question-bank.repository.interface';
import { GetQuestionsQuery } from './get-questions.query';

@QueryHandler(GetQuestionsQuery)
export class GetQuestionsQueryHandler implements IQueryHandler<GetQuestionsQuery> {
  constructor(
    @Inject(IQuestionBankRepository)
    private readonly questionBankRepository: IQuestionBankRepository,
  ) {}

  async execute(query: GetQuestionsQuery): Promise<QueryResult<Question>> {
    const page = query.limit > 0 ? Math.floor(query.skip / query.limit) + 1 : 1;
    return this.questionBankRepository.findQuestionsByBankId({
      bankId: query.bankId,
      skip: query.skip,
      limit: query.limit,
      page,
    });
  }
}
