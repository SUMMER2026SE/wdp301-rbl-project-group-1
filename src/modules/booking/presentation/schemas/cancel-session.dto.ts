import { createZodDto } from 'nestjs-zod';
import { z } from '../../../../shared/infrastructure/documentation/zod/zod';
import { CancelSessionResult } from '../../application/commands/cancel-session/cancel-session.result';

export const CancelSessionSchema = z
  .object({
    reason: z.string().trim().min(1).meta({
      example: 'I have an urgent personal schedule conflict',
      description: 'Reason for cancelling the session',
    }),
  })
  .meta({ id: 'CancelSessionDto' });

export class CancelSessionDto extends createZodDto(CancelSessionSchema) {}

export const CancelSessionResponseSchema = z
  .object({
    sessionId: z.string().meta({
      example: 'clxsession00000123456789',
      description: 'Cancelled session ID',
    }),
    status: z.enum(['CANCELLED']).meta({
      example: 'CANCELLED',
      description: 'Session status after cancellation',
    }),
    cancelledByUserId: z.string().meta({
      example: 'clxuser00000123456789',
      description: 'User who cancelled the session',
    }),
    reason: z.string().meta({
      example: 'I have an urgent personal schedule conflict',
      description: 'Cancellation reason',
    }),
    cancelledAt: z.string().datetime().meta({
      example: '2026-06-11T09:00:00.000Z',
      description: 'Cancellation timestamp',
    }),
    startTime: z.string().datetime().meta({
      example: '2026-06-12T08:00:00.000Z',
      description: 'Original session start time',
    }),
    hoursUntilStart: z.number().meta({
      example: 23.5,
      description: 'Hours between cancellation time and session start time',
    }),
    isLateCancellation: z.boolean().meta({
      example: true,
      description:
        'Whether the cancellation happened less than 24 hours before start time',
    }),
    penaltyAmount: z.number().meta({
      example: 250000,
      description: 'Penalty amount calculated from the booking price policy',
    }),
  })
  .meta({ id: 'CancelSessionResponseDto' });

export class CancelSessionResponseDto extends createZodDto(
  CancelSessionResponseSchema,
) {
  static fromResult(result: CancelSessionResult): CancelSessionResponseDto {
    const dto = new CancelSessionResponseDto();
    dto.sessionId = result.sessionId;
    dto.status = result.status as 'CANCELLED';
    dto.cancelledByUserId = result.cancelledByUserId;
    dto.reason = result.reason;
    dto.cancelledAt = result.cancelledAt;
    dto.startTime = result.startTime;
    dto.hoursUntilStart = result.hoursUntilStart;
    dto.isLateCancellation = result.isLateCancellation;
    dto.penaltyAmount = result.penaltyAmount;
    return dto;
  }
}
