import { createZodDto } from 'nestjs-zod';
import { AttendanceStatus } from '../../../../shared/domain/enums/enums';
import { z } from '../../../../shared/infrastructure/documentation/zod/zod';
import { MarkSessionAttendanceResult } from '../../application/commands/mark-session-attendance/mark-session-attendance.result';

export const MarkSessionAttendanceSchema = z.object({
  studentId: z.string().meta({
    example: 'clxstudent00000123456789',
    description: 'ID of the student attending the session',
  }),
  status: z.nativeEnum(AttendanceStatus).meta({
    example: AttendanceStatus.PRESENT,
    description: 'Attendance status',
  }),
  notes: z.string().optional().meta({
    example: 'Student performed well in algebra concepts',
    description: 'Optional notes by the tutor',
  }),
});

export class MarkSessionAttendanceDto extends createZodDto(
  MarkSessionAttendanceSchema,
) {}

export const MarkSessionAttendanceResponseSchema = z.object({
  id: z.string(),
  sessionId: z.string(),
  studentId: z.string(),
  status: z.string(),
  notes: z.string().nullable(),
  createdAt: z.string().datetime(),
});

export class MarkSessionAttendanceResponseDto extends createZodDto(
  MarkSessionAttendanceResponseSchema,
) {
  static fromResult(
    result: MarkSessionAttendanceResult,
  ): MarkSessionAttendanceResponseDto {
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
