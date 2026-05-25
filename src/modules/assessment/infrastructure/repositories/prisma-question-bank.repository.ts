import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../shared/infrastructure/database/prisma/prisma.service';
import {
  createQueryResult,
  QueryResult,
} from '../../../../shared/domain/common/query';
import { QuestionBank } from '../../domain/entities/question-bank.entity';
import { Question } from '../../domain/entities/question.entity';
import {
  IQuestionBankRepository,
  QuestionBankPaginatedParams,
  QuestionPaginatedParams,
} from '../../domain/repositories/question-bank.repository.interface';
import { QuestionBankMapper } from '../mapper/question-bank.mapper';
import { QuestionMapper } from '../mapper/question.mapper';
import { PrismaQuestionRecord } from './question-bank.repository.type';

@Injectable()
export class PrismaQuestionBankRepository implements IQuestionBankRepository {
  private readonly bankMapper = new QuestionBankMapper();
  private readonly questionMapper = new QuestionMapper();

  constructor(private readonly prisma: PrismaService) {}

  // ── Question Bank ──

  async create(bank: QuestionBank): Promise<QuestionBank> {
    const data = this.bankMapper.toPersistence(bank);
    const record = await this.prisma.questionBank.create({ data });
    return this.bankMapper.toDomain(record);
  }

  async findById(id: string): Promise<QuestionBank | null> {
    const record = await this.prisma.questionBank.findUnique({ where: { id } });
    if (!record) return null;
    return this.bankMapper.toDomain(record);
  }

  async findByCourseId(
    params: QuestionBankPaginatedParams,
  ): Promise<QueryResult<QuestionBank>> {
    const where = { courseId: params.courseId };

    const [records, total] = await Promise.all([
      this.prisma.questionBank.findMany({
        where,
        skip: params.skip,
        take: params.limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.questionBank.count({ where }),
    ]);

    return createQueryResult(
      records.map((r) => this.bankMapper.toDomain(r)),
      total,
      params,
    );
  }

  async update(bank: QuestionBank): Promise<QuestionBank> {
    const data = this.bankMapper.toPersistence(bank);
    const record = await this.prisma.questionBank.update({
      where: { id: bank.id },
      data: {
        title: data.title,
        description: data.description,
      },
    });
    return this.bankMapper.toDomain(record);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.questionBank.delete({ where: { id } });
  }

  // ── Questions ──

  async addQuestion(question: Question): Promise<Question> {
    const data = this.questionMapper.toPersistence(question);
    const record = await this.prisma.question.create({
      data: {
        ...data,
        options: {
          create: question.options.map((o) => ({
            id: o.id,
            content: o.content,
            isCorrect: o.isCorrect,
            orderIndex: o.orderIndex,
          })),
        },
      },
      include: { options: true },
    });
    return this.questionMapper.toDomain(record as PrismaQuestionRecord);
  }

  async findQuestionById(id: string): Promise<Question | null> {
    const record = await this.prisma.question.findUnique({
      where: { id },
      include: { options: { orderBy: { orderIndex: 'asc' } } },
    });
    if (!record) return null;
    return this.questionMapper.toDomain(record as PrismaQuestionRecord);
  }

  async findQuestionsByBankId(
    params: QuestionPaginatedParams,
  ): Promise<QueryResult<Question>> {
    const where = { bankId: params.bankId };

    const [records, total] = await Promise.all([
      this.prisma.question.findMany({
        where,
        include: { options: { orderBy: { orderIndex: 'asc' } } },
        skip: params.skip,
        take: params.limit,
        orderBy: { orderIndex: 'asc' },
      }),
      this.prisma.question.count({ where }),
    ]);

    return createQueryResult(
      records.map((r) =>
        this.questionMapper.toDomain(r as PrismaQuestionRecord),
      ),
      total,
      params,
    );
  }

  async updateQuestion(question: Question): Promise<Question> {
    const data = this.questionMapper.toPersistence(question);

    // Delete existing options and recreate
    await this.prisma.option.deleteMany({ where: { questionId: question.id } });

    const record = await this.prisma.question.update({
      where: { id: question.id },
      data: {
        type: data.type,
        difficulty: data.difficulty,
        content: data.content,
        points: data.points,
        orderIndex: data.orderIndex,
        options: {
          create: question.options.map((o) => ({
            id: o.id,
            content: o.content,
            isCorrect: o.isCorrect,
            orderIndex: o.orderIndex,
          })),
        },
      },
      include: { options: { orderBy: { orderIndex: 'asc' } } },
    });
    return this.questionMapper.toDomain(record as PrismaQuestionRecord);
  }

  async deleteQuestion(id: string): Promise<void> {
    await this.prisma.question.delete({ where: { id } });
  }
}
