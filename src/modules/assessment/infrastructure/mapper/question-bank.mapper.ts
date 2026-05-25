import { IMapper } from '../../../../shared/application/interfaces/mapper.interface';
import { QuestionBank } from '../../domain/entities/question-bank.entity';
import {
  PrismaQuestionBankRecord,
  QuestionBankWriteData,
} from '../repositories/question-bank.repository.type';

export class QuestionBankMapper implements IMapper<
  QuestionBank,
  PrismaQuestionBankRecord | QuestionBankWriteData
> {
  toDomain(record: PrismaQuestionBankRecord): QuestionBank {
    return QuestionBank.create(record.id, {
      courseId: record.courseId,
      title: record.title,
      description: record.description,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    });
  }

  toPersistence(bank: QuestionBank): QuestionBankWriteData {
    return {
      id: bank.id,
      courseId: bank.courseId,
      title: bank.title,
      description: bank.description ?? null,
    };
  }
}
