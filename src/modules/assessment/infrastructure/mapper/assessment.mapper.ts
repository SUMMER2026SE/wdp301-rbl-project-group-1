import { IMapper } from '../../../../shared/application/interfaces/mapper.interface';
import { Assessment } from '../../domain/entities/assessment.entity';
import { AssessmentBankConfig } from '../../domain/entities/assessment-bank-config.entity';
import {
  AssessmentBankConfigWriteData,
  AssessmentWriteData,
  PrismaAssessmentBankConfigRecord,
  PrismaAssessmentRecord,
} from '../repositories/assessment.repository.type';

export class AssessmentMapper implements IMapper<
  Assessment,
  PrismaAssessmentRecord | AssessmentWriteData
> {
  toDomain(record: PrismaAssessmentRecord): Assessment {
    return Assessment.create(record.id, {
      courseId: record.courseId,
      lessonId: record.lessonId,
      title: record.title,
      description: record.description,
      type: record.type,
      maxAttempts: record.maxAttempts,
      timeLimit: record.timeLimit,
      isRandomized: record.isRandomized,
      shuffleOptions: record.shuffleOptions,
      antiCheat: record.antiCheat,
      passScore: record.passScore,
      gradingPolicy: record.gradingPolicy,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    });
  }

  toPersistence(assessment: Assessment): AssessmentWriteData {
    return {
      id: assessment.id,
      courseId: assessment.courseId,
      lessonId: assessment.lessonId ?? null,
      title: assessment.title,
      description: assessment.description ?? null,
      type: assessment.type,
      maxAttempts: assessment.maxAttempts ?? null,
      timeLimit: assessment.timeLimit ?? null,
      isRandomized: assessment.isRandomized,
      shuffleOptions: assessment.shuffleOptions,
      antiCheat: assessment.antiCheat,
      passScore: assessment.passScore ?? null,
      gradingPolicy: assessment.gradingPolicy,
    };
  }
}

export class AssessmentBankConfigMapper implements IMapper<
  AssessmentBankConfig,
  PrismaAssessmentBankConfigRecord | AssessmentBankConfigWriteData
> {
  toDomain(record: PrismaAssessmentBankConfigRecord): AssessmentBankConfig {
    return AssessmentBankConfig.create(record.id, {
      assessmentId: record.assessmentId,
      bankId: record.bankId,
      difficulty: record.difficulty,
      count: record.count,
      pointsPerQuestion: record.pointsPerQuestion,
    });
  }

  toPersistence(config: AssessmentBankConfig): AssessmentBankConfigWriteData {
    return {
      id: config.id,
      assessmentId: config.assessmentId,
      bankId: config.bankId,
      difficulty: config.difficulty ?? null,
      count: config.count,
      pointsPerQuestion: config.pointsPerQuestion,
    };
  }
}
