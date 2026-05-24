import { createZodDto } from 'nestjs-zod';
import { z } from '../../../../shared/infrastructure/documentation/zod/zod';

const AttendanceStatusEnum = z.enum(['PRESENT', 'ABSENT', 'LATE']);

// ── Request DTOs ──

const MarkAttendanceItemSchema = z
  .object({
    studentId: z
      .string()
      .min(1)
      .meta({ description: 'Student ID', example: 'clhg12345000008l4stu001' }),
    status: AttendanceStatusEnum.meta({
      description: 'Attendance status',
      example: 'PRESENT',
    }),
    note: z
      .string()
      .optional()
      .meta({ description: 'Optional note', example: 'Arrived 5 min late' }),
  })
  .meta({ id: 'MarkAttendanceItemDto' });

export const MarkAttendanceSchema = z
  .object({
    attendances: z
      .array(MarkAttendanceItemSchema)
      .min(1)
      .meta({ description: 'List of student attendances to mark' }),
  })
  .meta({ id: 'MarkAttendanceDto' });

export class MarkAttendanceDto extends createZodDto(MarkAttendanceSchema) {}

// ── Response DTOs ──

export const AttendanceResponseSchema = z
  .object({
    id: z.string().meta({ example: 'clhg12345' }),
    lessonId: z.string().meta({ example: 'clhg12345000008l4les001' }),
    studentId: z.string().meta({ example: 'clhg12345000008l4stu001' }),
    status: AttendanceStatusEnum.meta({ example: 'PRESENT' }),
    note: z.string().nullable().meta({ example: 'Arrived 5 min late' }),
    markedAt: z
      .string()
      .datetime()
      .meta({ example: '2026-05-08T10:00:00.000Z' }),
    updatedAt: z
      .string()
      .datetime()
      .meta({ example: '2026-05-08T10:00:00.000Z' }),
  })
  .meta({ id: 'AttendanceResponseDto' });

export class AttendanceResponseDto extends createZodDto(
  AttendanceResponseSchema,
) {}

export const MarkAttendanceResultSchema = z
  .object({
    attendances: z.array(AttendanceResponseSchema),
  })
  .meta({ id: 'MarkAttendanceResultDto' });

export class MarkAttendanceResultDto extends createZodDto(
  MarkAttendanceResultSchema,
) {}
