import { createZodDto } from 'nestjs-zod';
import { z } from '../../../../shared/infrastructure/documentation/zod/zod';
import { CreateDisputeResult } from '../../application/commands/create-dispute/create-dispute.result';
import { SendDisputeMessageResult } from '../../application/commands/send-dispute-message/send-dispute-message.result';
import { ResolveDisputeResult } from '../../application/commands/resolve-dispute/resolve-dispute.result';

// --- Create Dispute DTO ---
export const CreateDisputeSchema = z.object({
  bookingId: z.string().optional().meta({
    example: 'clxbooking00000123456789',
    description: 'ID of the booking being disputed',
  }),
  sessionId: z.string().optional().meta({
    example: 'clxsession00000123456789',
    description: 'ID of the session being disputed',
  }),
  reason: z
    .string()
    .min(1, 'Reason is required')
    .max(1000, 'Reason is too long')
    .meta({
      example: 'Tutor did not show up for class.',
      description: 'Reason for disputing the booking/session',
    }),
});

export class CreateDisputeDto extends createZodDto(CreateDisputeSchema) {}

export const CreateDisputeResponseSchema = z.object({
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

export class CreateDisputeResponseDto extends createZodDto(
  CreateDisputeResponseSchema,
) {
  static fromResult(result: CreateDisputeResult): CreateDisputeResponseDto {
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

// --- Send Dispute Message DTO ---
export const SendDisputeMessageSchema = z.object({
  content: z
    .string()
    .min(1, 'Message content is required')
    .max(5000, 'Message is too long')
    .meta({
      example: 'Yes, I was present but the student did not show up.',
      description: 'Content of the dispute message',
    }),
});

export class SendDisputeMessageDto extends createZodDto(
  SendDisputeMessageSchema,
) {}

export const SendDisputeMessageResponseSchema = z.object({
  id: z.string(),
  ticketId: z.string(),
  senderId: z.string(),
  content: z.string(),
  createdAt: z.string().datetime(),
});

export class SendDisputeMessageResponseDto extends createZodDto(
  SendDisputeMessageResponseSchema,
) {
  static fromResult(
    result: SendDisputeMessageResult,
  ): SendDisputeMessageResponseDto {
    return {
      id: result.id,
      ticketId: result.ticketId,
      senderId: result.senderId,
      content: result.content,
      createdAt: result.createdAt,
    };
  }
}

// --- Resolve Dispute DTO ---
export const ResolveDisputeSchema = z.object({
  resolution: z.enum(['REFUND', 'REJECT']).meta({
    example: 'REFUND',
    description:
      'Decision on the dispute. REFUND to refund student, REJECT to reject dispute.',
  }),
});

export class ResolveDisputeDto extends createZodDto(ResolveDisputeSchema) {}

export const ResolveDisputeResponseSchema = z.object({
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

export class ResolveDisputeResponseDto extends createZodDto(
  ResolveDisputeResponseSchema,
) {
  static fromResult(result: ResolveDisputeResult): ResolveDisputeResponseDto {
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
