import { createZodDto } from 'nestjs-zod';
import { z } from '../../../../shared/infrastructure/documentation/zod/zod';
import { RescheduleSessionResult } from '../../application/commands/reschedule-session/reschedule-session.result';

export const RescheduleSessionSchema = z
  .object({
    proposedStartTime: z.string().datetime().meta({
      example: '2026-06-15T09:00:00.000Z',
      description: 'Requested new start time for the session',
    }),
    proposedEndTime: z.string().datetime().meta({
      example: '2026-06-15T10:30:00.000Z',
      description: 'Requested new end time for the session',
    }),
    reason: z.string().min(1).meta({
      example: 'I have a university exam on the current date',
      description: 'Reason for requesting the schedule change',
    }),
  })
  .refine(
    (value) =>
      new Date(value.proposedStartTime) < new Date(value.proposedEndTime),
    {
      message: 'proposedEndTime must be after proposedStartTime',
      path: ['proposedEndTime'],
    },
  )
  .meta({ id: 'RescheduleSessionDto' });

export class RescheduleSessionDto extends createZodDto(
  RescheduleSessionSchema,
) {}

export const RescheduleSessionResponseSchema = z
  .object({
    sessionId: z.string().meta({
      example: 'clxsession00000123456789',
      description: 'Updated session ID',
    }),
    status: z
      .enum([
        'SCHEDULED',
        'COMPLETED',
        'CANCELLED',
        'AWAITING_CONFIRMATION',
        'RESCHEDULE_REQUESTED',
      ])
      .meta({
        example: 'RESCHEDULE_REQUESTED',
        description: 'Updated session status',
      }),
    proposedStartTime: z.string().datetime().nullable().meta({
      example: '2026-06-15T09:00:00.000Z',
      description: 'Persisted requested start time',
    }),
    proposedEndTime: z.string().datetime().nullable().meta({
      example: '2026-06-15T10:30:00.000Z',
      description: 'Persisted requested end time',
    }),
    proposedReason: z.string().nullable().meta({
      example: 'I have a university exam on the current date',
      description: 'Persisted reason for the schedule change request',
    }),
  })
  .meta({ id: 'RescheduleSessionResponseDto' });

export class RescheduleSessionResponseDto extends createZodDto(
  RescheduleSessionResponseSchema,
) {
  static fromResult(
    result: RescheduleSessionResult,
  ): RescheduleSessionResponseDto {
    const dto = new RescheduleSessionResponseDto();
    dto.sessionId = result.sessionId;
    dto.status = result.status;
    dto.proposedStartTime = result.proposedStartTime;
    dto.proposedEndTime = result.proposedEndTime;
    dto.proposedReason = result.proposedReason;
    return dto;
  }
}
