import { createZodDto } from 'nestjs-zod';
import { z } from '../../../../shared/infrastructure/documentation/zod/zod';

// ─── Recommended Course ───────────────────────────────────────────────────────
export const RecommendedCourseItemSchema = z
  .object({
    id: z.string().meta({ example: 'cm9x8v7w60000abc123def456' }),
    tutorId: z.string().meta({ example: 'cm9x8v7w60000abc123def456' }),
    title: z.string().meta({ example: 'Toán 11 - Nâng cao' }),
    description: z
      .string()
      .nullable()
      .meta({ example: 'Khóa học toán 11 nâng cao...' }),
    price: z.number().nullable().meta({ example: 500000 }),
    level: z
      .enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED'])
      .meta({ example: 'INTERMEDIATE' }),
    status: z
      .enum(['DRAFT', 'PUBLISHED', 'ONGOING', 'CLOSED'])
      .meta({ example: 'PUBLISHED' }),
    subject: z.object({ id: z.string(), name: z.string().nullable() }),
    grade: z.object({ id: z.string(), name: z.string().nullable() }),
    createdAt: z
      .string()
      .datetime()
      .meta({ example: '2025-01-01T00:00:00.000Z' }),
  })
  .meta({ id: 'RecommendedCourseItemDto' });

/** Swagger DTO — presentation layer only */
export class RecommendedCourseItemDto extends createZodDto(
  RecommendedCourseItemSchema,
) {}

// ─── Recommended Tutor ───────────────────────────────────────────────────────
export const RecommendedTutorItemSchema = z
  .object({
    id: z.string().meta({ example: 'cm9x8v7w60000abc123def456' }),
    name: z.string().meta({ example: 'Nguyễn Văn A' }),
    avatarUrl: z
      .string()
      .nullable()
      .meta({ example: 'https://cdn.example/avatar.png' }),
    bio: z
      .string()
      .nullable()
      .meta({ example: 'Giáo viên 10 năm kinh nghiệm' }),
    specialization: z.string().nullable().meta({ example: 'Toán học, Vật lý' }),
    experience: z.number().nullable().meta({ example: 5 }),
    education: z.string().nullable().meta({ example: 'Đại học Bách Khoa' }),
    pricePerHour: z.number().nullable().meta({ example: 200000 }),
    rating: z.number().meta({ example: 4.8 }),
    reviewCount: z.number().meta({ example: 120 }),
    studentCount: z.number().meta({ example: 350 }),
    subjects: z
      .array(z.object({ id: z.string(), name: z.string(), slug: z.string() }))
      .meta({ example: [{ id: 'abc', name: 'Toán', slug: 'mathematics' }] }),
    grades: z
      .array(z.object({ id: z.string(), name: z.string(), slug: z.string() }))
      .meta({ example: [{ id: 'xyz', name: 'Lớp 11', slug: 'lop-11' }] }),
  })
  .meta({ id: 'RecommendedTutorItemDto' });

/** Swagger DTO — presentation layer only */
export class RecommendedTutorItemDto extends createZodDto(
  RecommendedTutorItemSchema,
) {}
