import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../shared/infrastructure/database/prisma/prisma.service';
import { Attempt } from '../../domain/entities/attempt.entity';
import { AttemptAnswer } from '../../domain/entities/attempt-answer.entity';
import {
  AttemptWithAnswers,
  AttemptWithQuestionsAndAnswers,
  IAttemptRepository,
} from '../../domain/repositories/attempt.repository.interface';
import { AttemptMapper, AttemptAnswerMapper } from '../mapper/attempt.mapper';
import { QuestionMapper } from '../mapper/question.mapper';
import {
  PrismaAttemptRecord,
  PrismaAttemptAnswerRecord,
} from './attempt.repository.type';
import { PrismaQuestionRecord } from './question-bank.repository.type';

@Injectable()
export class PrismaAttemptRepository implements IAttemptRepository {
  private readonly attemptMapper = new AttemptMapper();
  private readonly answerMapper = new AttemptAnswerMapper();
  private readonly questionMapper = new QuestionMapper();

  constructor(private readonly prisma: PrismaService) {}

  async create(attempt: Attempt): Promise<Attempt> {
    const data = this.attemptMapper.toPersistence(attempt);
    const record = await this.prisma.attempt.create({ data });
    return this.attemptMapper.toDomain(record as PrismaAttemptRecord);
  }

  async findById(id: string): Promise<Attempt | null> {
    const record = await this.prisma.attempt.findUnique({ where: { id } });
    if (!record) return null;
    return this.attemptMapper.toDomain(record as PrismaAttemptRecord);
  }

  async findByIdWithAnswers(
    id: string,
  ): Promise<AttemptWithQuestionsAndAnswers | null> {
    const record = await this.prisma.attempt.findUnique({
      where: { id },
      include: {
        answers: {
          include: {
            question: {
              include: { options: { orderBy: { orderIndex: 'asc' } } },
            },
          },
        },
      },
    });
    if (!record) return null;

    const attempt = this.attemptMapper.toDomain(record as PrismaAttemptRecord);
    const answers = record.answers.map(
      (a: PrismaAttemptAnswerRecord & { question: PrismaQuestionRecord }) => {
        const answer = this.answerMapper.toDomain(a);
        const question = this.questionMapper.toDomain(a.question);
        return Object.assign(answer, { question });
      },
    );

    return { attempt, answers };
  }

  async countByStudentAndAssessment(
    studentId: string,
    assessmentId: string,
  ): Promise<number> {
    return this.prisma.attempt.count({
      where: { studentId, assessmentId },
    });
  }

  async findByStudentAndAssessment(
    studentId: string,
    assessmentId: string,
  ): Promise<Attempt[]> {
    const records = await this.prisma.attempt.findMany({
      where: { studentId, assessmentId },
      orderBy: { startTime: 'desc' },
    });
    return records.map((r) =>
      this.attemptMapper.toDomain(r as PrismaAttemptRecord),
    );
  }

  async submitAttempt(
    attempt: Attempt,
    answers: AttemptAnswer[],
  ): Promise<AttemptWithAnswers> {
    const attemptData = this.attemptMapper.toPersistence(attempt);

    const result = await this.prisma.$transaction(async (tx) => {
      // Update attempt with score and endTime
      const updatedAttempt = await tx.attempt.update({
        where: { id: attempt.id },
        data: {
          endTime: attemptData.endTime,
          score: attemptData.score,
          isPassed: attemptData.isPassed,
        },
      });

      // Create all answers
      const createdAnswers = await Promise.all(
        answers.map((answer) => {
          const data = this.answerMapper.toPersistence(answer);
          return tx.attemptAnswer.create({ data });
        }),
      );

      return {
        attempt: updatedAttempt,
        answers: createdAnswers,
      };
    });

    return {
      attempt: this.attemptMapper.toDomain(
        result.attempt as PrismaAttemptRecord,
      ),
      answers: result.answers.map((a) =>
        this.answerMapper.toDomain(a as PrismaAttemptAnswerRecord),
      ),
    };
  }
}
