import { createZodDto } from 'nestjs-zod';
import {
  AssessmentType,
  GradingPolicy,
  QuestionDifficulty,
  QuestionType,
} from '../../../../shared/domain/enums/enums';
import { z } from '../../../../shared/infrastructure/documentation/zod/zod';

// ── Question Bank ──

export const CreateQuestionBankSchema = z
  .object({
    courseId: z.string().min(1).meta({ example: 'clhg12345000008l4f1h5g6i7' }),
    title: z.string().min(1).meta({ example: 'Bank Toán Chương 1' }),
    description: z
      .string()
      .optional()
      .meta({ example: 'Ngân hàng câu hỏi toán chương 1' }),
  })
  .meta({ id: 'CreateQuestionBankDto' });

export class CreateQuestionBankDto extends createZodDto(
  CreateQuestionBankSchema,
) {}

// ── Question ──

const QuestionTypeEnum = z.enum(QuestionType);
const DifficultyEnum = z.enum(QuestionDifficulty);

export const OptionInputSchema = z.object({
  content: z.string().min(1).meta({ example: 'Đáp án A' }),
  isCorrect: z.boolean().meta({ example: true }),
  orderIndex: z.number().meta({ example: 0 }),
});

export const AddQuestionSchema = z
  .object({
    type: QuestionTypeEnum.meta({ example: 'MULTIPLE_CHOICE' }),
    difficulty: DifficultyEnum.meta({ example: 'MEDIUM' }),
    content: z.string().min(1).meta({ example: '1 + 1 = ?' }),
    points: z.number().min(0).meta({ example: 10 }),
    orderIndex: z.number().meta({ example: 0 }),
    options: z.array(OptionInputSchema).min(1),
  })
  .meta({ id: 'AddQuestionDto' });

export class AddQuestionDto extends createZodDto(AddQuestionSchema) {}

// ── Assessment ──

const AssessmentTypeEnum = z.enum(AssessmentType);
const GradingPolicyEnum = z.enum(GradingPolicy);

export const BankConfigInputSchema = z.object({
  bankId: z.string().min(1).meta({ example: 'bank-uuid' }),
  difficulty: DifficultyEnum.optional().meta({ example: 'MEDIUM' }),
  count: z.number().min(1).meta({ example: 5 }),
  pointsPerQuestion: z.number().min(0).meta({ example: 10 }),
});

export const CreateAssessmentSchema = z
  .object({
    courseId: z.string().min(1).meta({ example: 'course-uuid' }),
    lessonId: z.string().optional().meta({ example: 'lesson-uuid' }),
    title: z.string().min(1).meta({ example: 'Quiz Chương 1' }),
    description: z
      .string()
      .optional()
      .meta({ example: 'Bài kiểm tra chương 1' }),
    type: AssessmentTypeEnum.meta({ example: 'QUIZ' }),
    gradingPolicy: GradingPolicyEnum.meta({ example: 'HIGHEST' }),
    isRandomized: z.boolean().meta({ example: true }),
    shuffleOptions: z.boolean().meta({ example: true }),
    antiCheat: z.boolean().meta({ example: false }),
    maxAttempts: z.number().optional().meta({ example: 3 }),
    timeLimit: z.number().optional().meta({ example: 30 }),
    passScore: z.number().optional().meta({ example: 60 }),
    bankConfigs: z.array(BankConfigInputSchema).min(1),
  })
  .meta({ id: 'CreateAssessmentDto' });

export class CreateAssessmentDto extends createZodDto(CreateAssessmentSchema) {}

// ── Attempt ──

export const AnswerInputSchema = z.object({
  questionId: z.string().min(1).meta({ example: 'question-uuid' }),
  optionIds: z.array(z.string()).meta({ example: ['option-uuid-1'] }),
  textAnswer: z.string().optional().meta({ example: 'My text answer' }),
});

export const SubmitAttemptSchema = z
  .object({
    answers: z.array(AnswerInputSchema).min(1),
  })
  .meta({ id: 'SubmitAttemptDto' });

export class SubmitAttemptDto extends createZodDto(SubmitAttemptSchema) {}
