import { createZodDto } from 'nestjs-zod';
import { z } from '../../../../shared/infrastructure/documentation/zod/zod';
import { RenewBookingResult } from '../../application/commands/renew-booking/renew-booking.result';
import { ScheduleRuleSchema } from './create-direct-booking.dto';

export const RenewBookingSchema = z
  .object({
    totalSessions: z.number().int().positive().meta({
      example: 8,
      description: 'Number of sessions for the renewed booking',
    }),
    message: z.string().nullable().optional().meta({
      example: 'Muốn tiếp tục học Toán với thầy',
      description: 'Optional message to the tutor',
    }),
    scheduleRules: z.array(ScheduleRuleSchema).min(1).optional().meta({
      description: 'Optional new schedule rules for the renewed booking',
    }),
  })
  .meta({ id: 'RenewBookingDto' });

export class RenewBookingDto extends createZodDto(RenewBookingSchema) {}

// ─── Response ────────────────────────────────────────────────────────────────

export const RenewBookingResponseSchema = z
  .object({
    bookingId: z.string().meta({
      example: 'clxbooking00000987654321',
      description: 'Newly created (renewed) booking ID',
    }),
    studentId: z.string().meta({ example: 'clxstudent001' }),
    tutorId: z.string().meta({ example: 'clxtutor001' }),
    subjectId: z.string().nullable().meta({ example: 'clxsubject001' }),
    mode: z.enum(['ONLINE', 'AT_HOME']).meta({ example: 'ONLINE' }),
    status: z
      .enum([
        'PENDING',
        'AWAITING_PAYMENT',
        'CONFIRMED',
        'COMPLETED',
        'CANCELLED',
      ])
      .meta({ example: 'PENDING' }),
    totalSessions: z.number().int().meta({ example: 8 }),
    message: z
      .string()
      .nullable()
      .meta({ example: 'Muốn tiếp tục học Toán với thầy' }),
    createdAt: z
      .string()
      .datetime()
      .meta({ example: '2025-01-01T00:00:00.000Z' }),
  })
  .meta({ id: 'RenewBookingResponseDto' });

export class RenewBookingResponseDto extends createZodDto(
  RenewBookingResponseSchema,
) {
  static fromResult(result: RenewBookingResult): RenewBookingResponseDto {
    const dto = new RenewBookingResponseDto();
    dto.bookingId = result.bookingId;
    dto.studentId = result.studentId;
    dto.tutorId = result.tutorId;
    dto.subjectId = result.subjectId;
    dto.mode = result.mode;
    dto.status = result.status;
    dto.totalSessions = result.totalSessions;
    dto.message = result.message;
    dto.createdAt = result.createdAt;
    return dto;
  }
}
