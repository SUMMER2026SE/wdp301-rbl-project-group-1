import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../shared/infrastructure/database/prisma/prisma.service';
import { Assessment } from '../../domain/entities/assessment.entity';
import { AssessmentBankConfig } from '../../domain/entities/assessment-bank-config.entity';
import { IAssessmentRepository } from '../../domain/repositories/assessment.repository.interface';
import {
  AssessmentMapper,
  AssessmentBankConfigMapper,
} from '../mapper/assessment.mapper';
import {
  PrismaAssessmentRecord,
  PrismaAssessmentBankConfigRecord,
} from './assessment.repository.type';

@Injectable()
export class PrismaAssessmentRepository implements IAssessmentRepository {
  private readonly assessmentMapper = new AssessmentMapper();
  private readonly configMapper = new AssessmentBankConfigMapper();

  constructor(private readonly prisma: PrismaService) {}

  async create(assessment: Assessment): Promise<Assessment> {
    const data = this.assessmentMapper.toPersistence(assessment);
    const record = await this.prisma.assessment.create({ data });
    return this.assessmentMapper.toDomain(record as PrismaAssessmentRecord);
  }

  async findById(id: string): Promise<Assessment | null> {
    const record = await this.prisma.assessment.findUnique({ where: { id } });
    if (!record) return null;
    return this.assessmentMapper.toDomain(record as PrismaAssessmentRecord);
  }

  async findByCourseId(courseId: string): Promise<Assessment[]> {
    const records = await this.prisma.assessment.findMany({
      where: { courseId },
      orderBy: { createdAt: 'desc' },
    });
    return records.map((r) =>
      this.assessmentMapper.toDomain(r as PrismaAssessmentRecord),
    );
  }

  async findByLessonId(lessonId: string): Promise<Assessment[]> {
    const records = await this.prisma.assessment.findMany({
      where: { lessonId },
      orderBy: { createdAt: 'desc' },
    });
    return records.map((r) =>
      this.assessmentMapper.toDomain(r as PrismaAssessmentRecord),
    );
  }

  async update(assessment: Assessment): Promise<Assessment> {
    const data = this.assessmentMapper.toPersistence(assessment);
    const record = await this.prisma.assessment.update({
      where: { id: assessment.id },
      data: {
        title: data.title,
        description: data.description,
        maxAttempts: data.maxAttempts,
        timeLimit: data.timeLimit,
        isRandomized: data.isRandomized,
        shuffleOptions: data.shuffleOptions,
        antiCheat: data.antiCheat,
        passScore: data.passScore,
        gradingPolicy: data.gradingPolicy,
      },
    });
    return this.assessmentMapper.toDomain(record as PrismaAssessmentRecord);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.assessment.delete({ where: { id } });
  }

  // ── Bank Configs ──

  async addBankConfig(
    config: AssessmentBankConfig,
  ): Promise<AssessmentBankConfig> {
    const data = this.configMapper.toPersistence(config);
    const record = await this.prisma.assessmentBankConfig.create({ data });
    return this.configMapper.toDomain(
      record as PrismaAssessmentBankConfigRecord,
    );
  }

  async findBankConfigsByAssessmentId(
    assessmentId: string,
  ): Promise<AssessmentBankConfig[]> {
    const records = await this.prisma.assessmentBankConfig.findMany({
      where: { assessmentId },
    });
    return records.map((r) =>
      this.configMapper.toDomain(r as PrismaAssessmentBankConfigRecord),
    );
  }

  async deleteBankConfig(id: string): Promise<void> {
    await this.prisma.assessmentBankConfig.delete({ where: { id } });
  }

  async deleteBankConfigsByAssessmentId(assessmentId: string): Promise<void> {
    await this.prisma.assessmentBankConfig.deleteMany({
      where: { assessmentId },
    });
  }
}
