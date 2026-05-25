import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../shared/infrastructure/database/prisma/prisma.service';
import { GradebookRecord } from '../../domain/entities/gradebook-record.entity';
import { IGradebookRepository } from '../../domain/repositories/gradebook.repository.interface';
import { GradebookRecordMapper } from '../mapper/attempt.mapper';
import { PrismaGradebookRecordRecord } from './attempt.repository.type';

@Injectable()
export class PrismaGradebookRepository implements IGradebookRepository {
  private readonly mapper = new GradebookRecordMapper();

  constructor(private readonly prisma: PrismaService) {}

  async upsert(record: GradebookRecord): Promise<GradebookRecord> {
    const data = this.mapper.toPersistence(record);
    const result = await this.prisma.gradebookRecord.upsert({
      where: {
        studentId_assessmentId: {
          studentId: data.studentId,
          assessmentId: data.assessmentId,
        },
      },
      create: data,
      update: {
        finalScore: data.finalScore,
        isPassed: data.isPassed,
        bestAttemptId: data.bestAttemptId,
      },
    });
    return this.mapper.toDomain(result as PrismaGradebookRecordRecord);
  }

  async findByStudentAndAssessment(
    studentId: string,
    assessmentId: string,
  ): Promise<GradebookRecord | null> {
    const record = await this.prisma.gradebookRecord.findUnique({
      where: {
        studentId_assessmentId: {
          studentId,
          assessmentId,
        },
      },
    });
    if (!record) return null;
    return this.mapper.toDomain(record as PrismaGradebookRecordRecord);
  }

  async findByStudentAndCourse(
    studentId: string,
    courseId: string,
  ): Promise<GradebookRecord[]> {
    const records = await this.prisma.gradebookRecord.findMany({
      where: { studentId, courseId },
      orderBy: { createdAt: 'desc' },
    });
    return records.map((r) =>
      this.mapper.toDomain(r as PrismaGradebookRecordRecord),
    );
  }

  async findByCourse(courseId: string): Promise<GradebookRecord[]> {
    const records = await this.prisma.gradebookRecord.findMany({
      where: { courseId },
      orderBy: { createdAt: 'desc' },
    });
    return records.map((r) =>
      this.mapper.toDomain(r as PrismaGradebookRecordRecord),
    );
  }
}
