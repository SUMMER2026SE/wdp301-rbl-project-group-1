import { createZodDto } from 'nestjs-zod';
import { AttendanceStatus } from '../../../../shared/domain/enums/enums';
import { z } from '../../../../shared/infrastructure/documentation/zod/zod';
import { TakeAttendanceResult } from '../../application/commands/take-attendance/take-attendance.result';

export const TakeAttendanceSchema = z.object({
  status: z.nativeEnum(AttendanceStatus).meta({
    example: AttendanceStatus.PRESENT,
    description: 'Attendance status of the student',
  }),
  notes: z.string().optional().meta({
    example: 'Student was present and actively participated',
    description: 'Optional notes by the tutor about this session',
  }),
});

export class TakeAttendanceDto extends createZodDto(TakeAttendanceSchema) {}

export const TakeAttendanceResponseSchema = z.object({
  id: z.string(),
  sessionId: z.string(),
  studentId: z.string(),
  status: z.string(),
  notes: z.string().nullable(),
  sessionStatus: z.string(),
  createdAt: z.string().datetime(),
});

export class TakeAttendanceResponseDto extends createZodDto(
  TakeAttendanceResponseSchema,
) {
  static fromResult(result: TakeAttendanceResult): TakeAttendanceResponseDto {
    return {
      id: result.id,
      sessionId: result.sessionId,
      studentId: result.studentId,
      status: result.status,
      notes: result.notes,
      sessionStatus: result.sessionStatus,
      createdAt: result.createdAt,
    };
  }
}
