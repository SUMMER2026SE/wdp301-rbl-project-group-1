import { createZodDto } from 'nestjs-zod';
import { z } from '../../../../shared/infrastructure/documentation/zod/zod';

export const CreateCourseResultSchema = z
  .object({
    id: z.string().meta({
      description: 'The ID of the newly created course',
      example: 'clhg12345000008l4f1h5g6i7',
    }),
  })
  .meta({ id: 'CreateCourseResultDto' });

export class CreateCourseResultDto extends createZodDto(
  CreateCourseResultSchema,
) {}

export const UpdateCourseResultSchema = z
  .object({
    id: z.string().meta({
      description: 'The ID of the updated course',
      example: 'clhg12345000008l4f1h5g6i7',
    }),
  })
  .meta({ id: 'UpdateCourseResultDto' });

export class UpdateCourseResultDto extends createZodDto(
  UpdateCourseResultSchema,
) {}

export const CourseResponseSchema = z
  .object({
    id: z.string().meta({ example: 'cm9x8v7w60000abc123def456' }),
    tutorId: z.string().meta({ example: 'cm9x8v7w60000abc123def456' }),
    title: z.string().meta({ example: 'Toán 11 - Nâng cao' }),
    description: z
      .string()
      .nullable()
      .meta({ example: 'Khóa học toán 11 nâng cao...' }),
    price: z.number().nullable().meta({ example: 500000 }),
    subjectId: z.string().meta({ example: 'cm9x8v7w60000abc123def456' }),
    subjectName: z.string().nullable().meta({ example: 'Toán' }),
    gradeId: z.string().meta({ example: 'cm9x8v7w60000abc123def456' }),
    gradeName: z.string().nullable().meta({ example: 'Lớp 11' }),
    level: z
      .enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED'])
      .meta({ example: 'INTERMEDIATE' }),
    status: z
      .enum(['DRAFT', 'PUBLISHED', 'ONGOING', 'CLOSED'])
      .meta({ example: 'PUBLISHED' }),
    createdAt: z
      .string()
      .datetime()
      .meta({ example: '2025-01-01T00:00:00.000Z' }),
  })
  .meta({ id: 'CourseResponseDto' });

export class CourseResponseDto extends createZodDto(CourseResponseSchema) {}

export const JoinedStudentSchema = z
  .object({
    studentId: z.string().meta({ example: 'cm9x8v7w60000abc123def456' }),
    email: z.string().email().meta({ example: 'student@edura.dev' }),
    nickname: z.string().nullable().meta({ example: 'Minh' }),
    avatarUrl: z
      .string()
      .nullable()
      .meta({ example: 'https://cdn.example/avatar.png' }),
    school: z.string().nullable().meta({ example: 'ABC High School' }),
    learningGoal: z
      .string()
      .nullable()
      .meta({ example: 'Improve math fundamentals' }),
    status: z
      .enum(['PENDING', 'ACTIVE', 'COMPLETED', 'CANCELLED'])
      .meta({ example: 'ACTIVE' }),
    enrolledAt: z
      .string()
      .datetime()
      .meta({ example: '2025-01-01T00:00:00.000Z' }),
  })
  .meta({ id: 'JoinedStudentDto' });

export class JoinedStudentDto extends createZodDto(JoinedStudentSchema) {}

export const GetJoinedStudentsResultSchema = z
  .object({
    students: z.array(JoinedStudentSchema),
  })
  .meta({ id: 'GetJoinedStudentsResultDto' });

export class GetJoinedStudentsResultDto extends createZodDto(
  GetJoinedStudentsResultSchema,
) {}
