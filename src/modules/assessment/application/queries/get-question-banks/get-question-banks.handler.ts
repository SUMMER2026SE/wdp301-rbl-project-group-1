import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { QueryResult } from '../../../../../shared/domain/common/query';
import { QuestionBank } from '../../../domain/entities/question-bank.entity';
import { IQuestionBankRepository } from '../../../domain/repositories/question-bank.repository.interface';
import { GetQuestionBanksQuery } from './get-question-banks.query';

@QueryHandler(GetQuestionBanksQuery)
export class GetQuestionBanksQueryHandler implements IQueryHandler<GetQuestionBanksQuery> {
  constructor(
    @Inject(IQuestionBankRepository)
    private readonly questionBankRepository: IQuestionBankRepository,
  ) {}

  async execute(
    query: GetQuestionBanksQuery,
  ): Promise<QueryResult<QuestionBank>> {
    const page = query.limit > 0 ? Math.floor(query.skip / query.limit) + 1 : 1;
    return this.questionBankRepository.findByCourseId({
      courseId: query.courseId,
      skip: query.skip,
      limit: query.limit,
      page,
    });
  }
}
