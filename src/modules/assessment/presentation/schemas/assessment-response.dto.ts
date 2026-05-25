import { createZodDto } from 'nestjs-zod';
import { z } from '../../../../shared/infrastructure/documentation/zod/zod';

// ── Generic ID Result ──

export const IdResultSchema = z
  .object({
    id: z
      .string()
      .meta({ description: 'Created resource ID', example: 'uuid' }),
  })
  .meta({ id: 'IdResultDto' });

export class IdResultDto extends createZodDto(IdResultSchema) {}

// ── Start Attempt ──

export const OptionResponseSchema = z.object({
  id: z.string().meta({ example: 'option-uuid' }),
  content: z.string().meta({ example: 'Đáp án A' }),
  orderIndex: z.number().meta({ example: 0 }),
});

export const QuestionResponseSchema = z.object({
  id: z.string().meta({ example: 'question-uuid' }),
  type: z.string().meta({ example: 'MULTIPLE_CHOICE' }),
  difficulty: z.string().meta({ example: 'MEDIUM' }),
  content: z.string().meta({ example: '1 + 1 = ?' }),
  options: z.array(OptionResponseSchema),
  assignedPoints: z.number().meta({ example: 10 }),
});

export const StartAttemptResponseSchema = z
  .object({
    attemptId: z.string().meta({ example: 'attempt-uuid' }),
    questions: z.array(QuestionResponseSchema),
  })
  .meta({ id: 'StartAttemptResponseDto' });

export class StartAttemptResponseDto extends createZodDto(
  StartAttemptResponseSchema,
) {}

// ── Submit Attempt ──

export const SubmitAttemptResponseSchema = z
  .object({
    attemptId: z.string().meta({ example: 'attempt-uuid' }),
    score: z.number().meta({ example: 85.5 }),
    isPassed: z.boolean().meta({ example: true }),
    totalPoints: z.number().meta({ example: 100 }),
    earnedPoints: z.number().meta({ example: 85 }),
  })
  .meta({ id: 'SubmitAttemptResponseDto' });

export class SubmitAttemptResponseDto extends createZodDto(
  SubmitAttemptResponseSchema,
) {}

// ── Question Bank Response ──

export const QuestionBankResponseSchema = z
  .object({
    id: z.string().meta({ example: 'bank-uuid' }),
    courseId: z.string().meta({ example: 'course-uuid' }),
    title: z.string().meta({ example: 'Bank Toán Chương 1' }),
    description: z.string().nullable().meta({ example: 'Mô tả ngân hàng' }),
    createdAt: z
      .string()
      .datetime()
      .meta({ example: '2026-05-08T09:00:00.000Z' }),
  })
  .meta({ id: 'QuestionBankResponseDto' });

export class QuestionBankResponseDto extends createZodDto(
  QuestionBankResponseSchema,
) {}

// ── Assessment Response ──

export const AssessmentResponseSchema = z
  .object({
    id: z.string().meta({ example: 'assessment-uuid' }),
    courseId: z.string().meta({ example: 'course-uuid' }),
    lessonId: z.string().nullable().meta({ example: 'lesson-uuid' }),
    title: z.string().meta({ example: 'Quiz Chương 1' }),
    type: z.string().meta({ example: 'QUIZ' }),
    maxAttempts: z.number().nullable().meta({ example: 3 }),
    passScore: z.number().nullable().meta({ example: 60 }),
    gradingPolicy: z.string().meta({ example: 'HIGHEST' }),
    createdAt: z
      .string()
      .datetime()
      .meta({ example: '2026-05-08T09:00:00.000Z' }),
  })
  .meta({ id: 'AssessmentResponseDto' });

export class AssessmentResponseDto extends createZodDto(
  AssessmentResponseSchema,
) {}

// ── Gradebook Response ──

export const GradebookResponseSchema = z
  .object({
    id: z.string().meta({ example: 'gradebook-uuid' }),
    assessmentId: z.string().meta({ example: 'assessment-uuid' }),
    finalScore: z.number().meta({ example: 85.5 }),
    isPassed: z.boolean().meta({ example: true }),
    bestAttemptId: z.string().nullable().meta({ example: 'attempt-uuid' }),
    updatedAt: z
      .string()
      .datetime()
      .meta({ example: '2026-05-08T09:00:00.000Z' }),
  })
  .meta({ id: 'GradebookResponseDto' });

export class GradebookResponseDto extends createZodDto(
  GradebookResponseSchema,
) {}

// ── Import Excel Response ──

export const ImportRowErrorSchema = z.object({
  row: z.number().meta({ example: 3 }),
  field: z.string().meta({ example: 'type' }),
  message: z.string().meta({
    example:
      'Invalid type "WRONG". Must be one of: MULTIPLE_CHOICE, TRUE_FALSE, TEXT_ANSWER',
  }),
});

export const ImportQuestionsResponseSchema = z
  .object({
    totalRows: z.number().meta({ example: 10 }),
    importedCount: z.number().meta({ example: 8 }),
    skippedCount: z.number().meta({ example: 2 }),
    errors: z.array(ImportRowErrorSchema),
  })
  .meta({ id: 'ImportQuestionsResponseDto' });

export class ImportQuestionsResponseDto extends createZodDto(
  ImportQuestionsResponseSchema,
) {}
