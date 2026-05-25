import {
  QueryParams,
  QueryResult,
} from '../../../../shared/domain/common/query';
import { QuestionBank } from '../entities/question-bank.entity';
import { Question } from '../entities/question.entity';

export interface QuestionBankPaginatedParams extends QueryParams {
  courseId: string;
}

export interface QuestionPaginatedParams extends QueryParams {
  bankId: string;
}

export const IQuestionBankRepository = Symbol('IQuestionBankRepository');

export interface IQuestionBankRepository {
  // Question Bank
  create(bank: QuestionBank): Promise<QuestionBank>;
  findById(id: string): Promise<QuestionBank | null>;
  findByCourseId(
    params: QuestionBankPaginatedParams,
  ): Promise<QueryResult<QuestionBank>>;
  update(bank: QuestionBank): Promise<QuestionBank>;
  delete(id: string): Promise<void>;

  // Questions in bank
  addQuestion(question: Question): Promise<Question>;
  findQuestionById(id: string): Promise<Question | null>;
  findQuestionsByBankId(
    params: QuestionPaginatedParams,
  ): Promise<QueryResult<Question>>;
  updateQuestion(question: Question): Promise<Question>;
  deleteQuestion(id: string): Promise<void>;
}
