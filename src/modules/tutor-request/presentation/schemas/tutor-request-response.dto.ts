import { createZodDto } from 'nestjs-zod';
import { z } from '../../../../shared/infrastructure/documentation/zod/zod';
import { CreateTutorRequestResult } from '../../application/commands/create-tutor-request/create-tutor-request.result';
import { SetTutorBidResult } from '../../application/commands/set-tutor-bid/set-tutor-bid.result';

export const TutorRequestResponseSchema = z
  .object({
    id: z.string().meta({ example: 'clxrequest00000123456789' }),
    studentId: z.string().meta({ example: 'clxstudent00000123456789' }),
    subjectId: z
      .string()
      .nullable()
      .meta({ example: 'clxsubject00000123456789' }),
    title: z.string().meta({ example: 'Need a math tutor' }),
    description: z.string().meta({ example: 'Need help twice a week.' }),
    mode: z.enum(['ONLINE', 'AT_HOME']).meta({ example: 'ONLINE' }),
    budget: z.number().nullable().meta({ example: 250000 }),
    status: z.enum(['OPEN', 'CLOSED', 'CANCELLED']).meta({ example: 'OPEN' }),
    createdAt: z
      .string()
      .datetime()
      .meta({ example: '2026-05-31T10:00:00.000Z' }),
  })
  .meta({ id: 'TutorRequestResponseDto' });

export class TutorRequestResponseDto extends createZodDto(
  TutorRequestResponseSchema,
) {
  static fromResult(result: CreateTutorRequestResult): TutorRequestResponseDto {
    const dto = new TutorRequestResponseDto();
    dto.id = result.id;
    dto.studentId = result.studentId;
    dto.subjectId = result.subjectId;
    dto.title = result.title;
    dto.description = result.description;
    dto.mode = result.mode;
    dto.budget = result.budget;
    dto.status = result.status;
    dto.createdAt = result.createdAt.toISOString();
    return dto;
  }
}

export const TutorBidResponseSchema = z
  .object({
    id: z.string().meta({ example: 'clxbid00000123456789' }),
    requestId: z.string().meta({ example: 'clxrequest00000123456789' }),
    tutorId: z.string().meta({ example: 'clxtutor00000123456789' }),
    proposedPrice: z.number().nullable().meta({ example: 220000 }),
    message: z.string().nullable().meta({
      example: 'I can help with algebra and prepare a weekly study plan.',
    }),
    status: z.enum(['PENDING', 'ACCEPTED', 'REJECTED']).meta({
      example: 'PENDING',
    }),
    createdAt: z
      .string()
      .datetime()
      .meta({ example: '2026-05-31T10:05:00.000Z' }),
    updatedAt: z
      .string()
      .datetime()
      .meta({ example: '2026-05-31T10:05:00.000Z' }),
  })
  .meta({ id: 'TutorBidResponseDto' });

export class TutorBidResponseDto extends createZodDto(
  TutorBidResponseSchema,
) {
  static fromResult(result: SetTutorBidResult): TutorBidResponseDto {
    const dto = new TutorBidResponseDto();
    dto.id = result.id;
    dto.requestId = result.requestId;
    dto.tutorId = result.tutorId;
    dto.proposedPrice = result.proposedPrice;
    dto.message = result.message;
    dto.status = result.status;
    dto.createdAt = result.createdAt.toISOString();
    dto.updatedAt = result.updatedAt.toISOString();
    return dto;
  }
}
