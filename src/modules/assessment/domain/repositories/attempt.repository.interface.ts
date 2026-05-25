import { Attempt } from '../entities/attempt.entity';
import { AttemptAnswer } from '../entities/attempt-answer.entity';
import { Question } from '../entities/question.entity';

export const IAttemptRepository = Symbol('IAttemptRepository');

export interface AttemptWithAnswers {
  attempt: Attempt;
  answers: AttemptAnswer[];
}

export interface AttemptWithQuestionsAndAnswers {
  attempt: Attempt;
  answers: (AttemptAnswer & { question: Question })[];
}

export interface IAttemptRepository {
  create(attempt: Attempt): Promise<Attempt>;
  findById(id: string): Promise<Attempt | null>;
  findByIdWithAnswers(
    id: string,
  ): Promise<AttemptWithQuestionsAndAnswers | null>;
  countByStudentAndAssessment(
    studentId: string,
    assessmentId: string,
  ): Promise<number>;
  findByStudentAndAssessment(
    studentId: string,
    assessmentId: string,
  ): Promise<Attempt[]>;

  // Submit flow
  submitAttempt(
    attempt: Attempt,
    answers: AttemptAnswer[],
  ): Promise<AttemptWithAnswers>;
}
