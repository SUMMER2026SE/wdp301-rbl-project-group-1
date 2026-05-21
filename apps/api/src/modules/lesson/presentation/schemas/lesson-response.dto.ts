import { createZodDto } from 'nestjs-zod';
import { z } from '../../../../shared/infrastructure/documentation/zod/zod';

export const CreateLessonResultSchema = z
  .object({
    id: z
      .string()
      .meta({ description: 'ID of created lesson', example: 'clhg12345' }),
  })
  .meta({ id: 'CreateLessonResultDto' });

export class CreateLessonResultDto extends createZodDto(
  CreateLessonResultSchema,
) {}

export const UpdateLessonResultSchema = z
  .object({
    id: z
      .string()
      .meta({ description: 'ID of updated lesson', example: 'clhg12345' }),
  })
  .meta({ id: 'UpdateLessonResultDto' });

export class UpdateLessonResultDto extends createZodDto(
  UpdateLessonResultSchema,
) {}

export const LessonResponseSchema = z
  .object({
    id: z.string().meta({ example: 'clhg12345' }),
    courseId: z.string().meta({ example: 'clhg12345000008l4f1h5g6i7' }),
    title: z.string().meta({ example: 'Buổi học 1' }),
    content: z
      .string()
      .nullable()
      .optional()
      .meta({ example: 'Nội dung buổi học' }),
    meetingUrl: z
      .string()
      .nullable()
      .optional()
      .meta({ example: 'https://meet.example/abc' }),
    videoUrl: z
      .string()
      .nullable()
      .optional()
      .meta({ example: 'https://video.example/abc' }),
    startTime: z
      .string()
      .datetime()
      .meta({ example: '2026-05-08T10:00:00.000Z' }),
    endTime: z
      .string()
      .datetime()
      .nullable()
      .optional()
      .meta({ example: '2026-05-08T11:00:00.000Z' }),
    orderIndex: z.number().meta({ example: 1 }),
    status: z
      .enum(['SCHEDULED', 'ONGOING', 'COMPLETED', 'CANCELLED'])
      .meta({ example: 'SCHEDULED' }),
    createdAt: z
      .string()
      .datetime()
      .meta({ example: '2026-05-08T09:00:00.000Z' }),
  })
  .meta({ id: 'LessonResponseDto' });

export class LessonResponseDto extends createZodDto(LessonResponseSchema) {}

export const LessonCourseSchema = z
  .object({
    id: z.string().meta({ example: 'clhg12345000008l4f1h5g6i7' }),
    title: z.string().meta({ example: 'Toán nâng cao' }),
    description: z.string().nullable().meta({ example: 'Mô tả khóa học' }),
    subjectName: z.string().nullable().meta({ example: 'Toán' }),
    gradeName: z.string().nullable().meta({ example: 'Lớp 10' }),
    level: z.string().meta({ example: 'INTERMEDIATE' }),
    status: z.string().meta({ example: 'PUBLISHED' }),
  })
  .meta({ id: 'LessonCourseDto' });

export const LessonTutorSchema = z
  .object({
    id: z.string().meta({ example: 'clhg12345000008l4f1h5g6i7' }),
    email: z.string().meta({ example: 'tutor@example.com' }),
    nickname: z.string().nullable().meta({ example: 'Thầy Minh' }),
    avatarUrl: z
      .string()
      .nullable()
      .meta({ example: 'https://example.com/avatar.jpg' }),
  })
  .meta({ id: 'LessonTutorDto' });

export const LessonDetailsResponseSchema = z
  .object({
    id: z.string().meta({ example: 'clhg12345' }),
    title: z.string().meta({ example: 'Buổi học 1' }),
    content: z.string().nullable().meta({ example: 'Nội dung buổi học' }),
    meetingUrl: z
      .string()
      .nullable()
      .meta({ example: 'https://meet.example/abc' }),
    videoUrl: z
      .string()
      .nullable()
      .meta({ example: 'https://video.example/abc' }),
    startTime: z
      .string()
      .datetime()
      .meta({ example: '2026-05-08T10:00:00.000Z' }),
    endTime: z
      .string()
      .datetime()
      .nullable()
      .meta({ example: '2026-05-08T11:00:00.000Z' }),
    orderIndex: z.number().meta({ example: 1 }),
    status: z.string().meta({ example: 'SCHEDULED' }),
    createdAt: z
      .string()
      .datetime()
      .meta({ example: '2026-05-08T09:00:00.000Z' }),
    course: LessonCourseSchema,
    tutor: LessonTutorSchema,
  })
  .meta({ id: 'LessonDetailsResponseDto' });

export class LessonDetailsResponseDto extends createZodDto(
  LessonDetailsResponseSchema,
) {}
