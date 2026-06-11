import { createZodDto } from 'nestjs-zod';
import { z } from '../../../../shared/infrastructure/documentation/zod/zod';
import { ConfirmSessionAttendanceResult } from '../../application/commands/confirm-session-attendance/confirm-session-attendance.result';

export const confirmSessionAttendanceSchema = z.object({
  notes: z.string().optional().meta({
    example: 'Student performed well in algebra concepts',
    description: 'Optional notes by the student',
  }),
});

export class ConfirmSessionAttendanceDto extends createZodDto(
  confirmSessionAttendanceSchema,
) {}

export const ConfirmSessionAttendanceResponseSchema = z.object({
  id: z.string(),
  sessionId: z.string(),
  studentId: z.string(),
  status: z.string(),
  notes: z.string().nullable(),
  createdAt: z.string().datetime(),
});

export class ConfirmSessionAttendanceResponseDto extends createZodDto(
  ConfirmSessionAttendanceResponseSchema,
) {
  static fromResult(
    result: ConfirmSessionAttendanceResult,
  ): ConfirmSessionAttendanceResponseDto {
    return {
      id: result.id,
      sessionId: result.sessionId,
      studentId: result.studentId,
      status: result.status,
      notes: result.notes,
      createdAt: result.createdAt,
    };
  }
}
