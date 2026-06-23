import { createZodDto } from 'nestjs-zod';
import { z } from '../../../../shared/infrastructure/documentation/zod/zod';
import { DisputeSessionResult } from '../../application/commands/dispute-session/dispute-session.result';

export const DisputeSessionSchema = z.object({
  reason: z
    .string()
    .min(1, 'Reason is required')
    .max(1000, 'Reason is too long')
    .meta({
      example: 'Tutor did not show up for the scheduled session.',
      description: 'Reason for disputing the session',
    }),
});

export class DisputeSessionDto extends createZodDto(DisputeSessionSchema) {}

export const DisputeSessionResponseSchema = z.object({
  id: z.string(),
  bookingId: z.string().nullable(),
  sessionId: z.string().nullable(),
  reporterId: z.string(),
  targetId: z.string().nullable(),
  reason: z.string(),
  status: z.string(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export class DisputeSessionResponseDto extends createZodDto(
  DisputeSessionResponseSchema,
) {
  static fromResult(result: DisputeSessionResult): DisputeSessionResponseDto {
    return {
      id: result.id,
      bookingId: result.bookingId,
      sessionId: result.sessionId,
      reporterId: result.reporterId,
      targetId: result.targetId,
      reason: result.reason,
      status: result.status,
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
    };
  }
}
