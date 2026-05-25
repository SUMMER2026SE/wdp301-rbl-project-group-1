import { IMapper } from '../../../../shared/application/interfaces/mapper.interface';
import { Question } from '../../domain/entities/question.entity';
import {
  PrismaQuestionRecord,
  QuestionWriteData,
} from '../repositories/question-bank.repository.type';

export class QuestionMapper implements IMapper<
  Question,
  PrismaQuestionRecord | QuestionWriteData
> {
  toDomain(record: PrismaQuestionRecord): Question {
    return Question.create(record.id, {
      assessmentId: record.assessmentId,
      bankId: record.bankId,
      type: record.type,
      difficulty: record.difficulty,
      content: record.content,
      points: record.points,
      orderIndex: record.orderIndex,
      options: record.options.map((o) => ({
        id: o.id,
        content: o.content,
        isCorrect: o.isCorrect,
        orderIndex: o.orderIndex,
      })),
    });
  }

  toPersistence(question: Question): QuestionWriteData {
    return {
      id: question.id,
      assessmentId: question.assessmentId ?? null,
      bankId: question.bankId ?? null,
      type: question.type,
      difficulty: question.difficulty,
      content: question.content,
      points: question.points,
      orderIndex: question.orderIndex,
    };
  }
}
