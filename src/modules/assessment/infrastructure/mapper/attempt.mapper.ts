import { IMapper } from '../../../../shared/application/interfaces/mapper.interface';
import { Attempt } from '../../domain/entities/attempt.entity';
import { AttemptAnswer } from '../../domain/entities/attempt-answer.entity';
import { GradebookRecord } from '../../domain/entities/gradebook-record.entity';
import {
  AttemptAnswerWriteData,
  AttemptWriteData,
  GradebookRecordWriteData,
  PrismaAttemptAnswerRecord,
  PrismaAttemptRecord,
  PrismaGradebookRecordRecord,
} from '../repositories/attempt.repository.type';

export class AttemptMapper implements IMapper<
  Attempt,
  PrismaAttemptRecord | AttemptWriteData
> {
  toDomain(record: PrismaAttemptRecord): Attempt {
    return Attempt.create(record.id, {
      assessmentId: record.assessmentId,
      studentId: record.studentId,
      startTime: record.startTime,
      endTime: record.endTime,
      score: record.score,
      isPassed: record.isPassed,
    });
  }

  toPersistence(attempt: Attempt): AttemptWriteData {
    return {
      id: attempt.id,
      assessmentId: attempt.assessmentId,
      studentId: attempt.studentId,
      startTime: attempt.startTime,
      endTime: attempt.endTime ?? null,
      score: attempt.score ?? null,
      isPassed: attempt.isPassed ?? null,
    };
  }
}

export class AttemptAnswerMapper implements IMapper<
  AttemptAnswer,
  PrismaAttemptAnswerRecord | AttemptAnswerWriteData
> {
  toDomain(record: PrismaAttemptAnswerRecord): AttemptAnswer {
    return AttemptAnswer.create(record.id, {
      attemptId: record.attemptId,
      questionId: record.questionId,
      optionIds: record.optionIds,
      textAnswer: record.textAnswer,
      isCorrect: record.isCorrect,
      points: record.points,
    });
  }

  toPersistence(answer: AttemptAnswer): AttemptAnswerWriteData {
    return {
      id: answer.id,
      attemptId: answer.attemptId,
      questionId: answer.questionId,
      optionIds: answer.optionIds,
      textAnswer: answer.textAnswer ?? null,
      isCorrect: answer.isCorrect ?? null,
      points: answer.points ?? null,
    };
  }
}

export class GradebookRecordMapper implements IMapper<
  GradebookRecord,
  PrismaGradebookRecordRecord | GradebookRecordWriteData
> {
  toDomain(record: PrismaGradebookRecordRecord): GradebookRecord {
    return GradebookRecord.create(record.id, {
      studentId: record.studentId,
      courseId: record.courseId,
      assessmentId: record.assessmentId,
      finalScore: record.finalScore,
      isPassed: record.isPassed,
      bestAttemptId: record.bestAttemptId,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    });
  }

  toPersistence(record: GradebookRecord): GradebookRecordWriteData {
    return {
      id: record.id,
      studentId: record.studentId,
      courseId: record.courseId,
      assessmentId: record.assessmentId,
      finalScore: record.finalScore,
      isPassed: record.isPassed,
      bestAttemptId: record.bestAttemptId ?? null,
    };
  }
}
