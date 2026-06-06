import { createZodDto } from 'nestjs-zod';
import { z } from '../../../../shared/infrastructure/documentation/zod/zod';
import { AcceptTutorBidResult } from '../../application/commands/accept-tutor-bid/accept-tutor-bid.result';
import { CreateTutorRequestResult } from '../../application/commands/create-tutor-request/create-tutor-request.result';
import { SetTutorBidResult } from '../../application/commands/set-tutor-bid/set-tutor-bid.result';
import { GetTutorRequestResult } from '../../application/queries/get-tutor-request/get-tutor-request.result';

export const TutorBidTutorSchema = z
  .object({
    name: z.string().nullable().meta({ example: 'John Doe' }),
    avatarUrl: z
      .string()
      .nullable()
      .meta({ example: 'https://example.com/avatar.jpg' }),
    rating: z.number().meta({ example: 4.8 }),
    reviewCount: z.number().meta({ example: 12 }),
  })
  .meta({ id: 'TutorBidTutorDto' });

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
    tutor: TutorBidTutorSchema.optional(),
  })
  .meta({ id: 'TutorBidResponseDto' });

export class TutorBidResponseDto extends createZodDto(TutorBidResponseSchema) {
  static fromResult(
    result: SetTutorBidResult | GetTutorRequestResult['bids'][number],
  ): TutorBidResponseDto {
    const dto = new TutorBidResponseDto();
    dto.id = result.id;
    dto.requestId = result.requestId;
    dto.tutorId = result.tutorId;
    dto.proposedPrice = result.proposedPrice;
    dto.message = result.message;
    dto.status = result.status;
    dto.createdAt = result.createdAt.toISOString();
    dto.updatedAt = result.updatedAt.toISOString();
    if ('tutor' in result && result.tutor) {
      dto.tutor = result.tutor;
    }
    return dto;
  }
}

export const TutorRequestResponseSchema = z
  .object({
    id: z.string().meta({ example: 'clxrequest00000123456789' }),
    studentId: z.string().meta({ example: 'clxstudent00000123456789' }),
    subjectId: z
      .string()
      .nullable()
      .meta({ example: 'clxsubject00000123456789' }),
    gradeId: z.string().nullable().meta({ example: 'clxgrade00000123456789' }),
    title: z.string().meta({ example: 'Need a math tutor' }),
    description: z.string().meta({ example: 'Need help twice a week.' }),
    mode: z.enum(['ONLINE', 'AT_HOME']).meta({ example: 'ONLINE' }),
    budget: z.number().nullable().meta({ example: 250000 }),
    status: z.enum(['OPEN', 'CLOSED', 'CANCELLED']).meta({ example: 'OPEN' }),
    totalSessions: z.number().optional().meta({ example: 10 }),
    createdAt: z
      .string()
      .datetime()
      .meta({ example: '2026-05-31T10:00:00.000Z' }),
    subject: z
      .object({
        id: z.string().meta({ example: 'clxsubject00000123456789' }),
        name: z.string().meta({ example: 'Toán' }),
        slug: z.string().meta({ example: 'toan' }),
      })
      .nullable()
      .optional(),
    grade: z
      .object({
        id: z.string().meta({ example: 'clxgrade00000123456789' }),
        name: z.string().meta({ example: 'Lớp 10' }),
        slug: z.string().meta({ example: 'lop-10' }),
        order: z.number().meta({ example: 10 }),
      })
      .nullable()
      .optional(),
    bids: z.array(TutorBidResponseSchema).optional(),
  })
  .meta({ id: 'TutorRequestResponseDto' });

export class TutorRequestResponseDto extends createZodDto(
  TutorRequestResponseSchema,
) {
  static fromResult(
    result: CreateTutorRequestResult | GetTutorRequestResult,
  ): TutorRequestResponseDto {
    const dto = new TutorRequestResponseDto();
    dto.id = result.id;
    dto.studentId = result.studentId;
    dto.subjectId = result.subjectId;
    dto.gradeId = result.gradeId;
    dto.title = result.title;
    dto.description = result.description;
    dto.mode = result.mode;
    dto.budget = result.budget;
    dto.status = result.status;
    dto.totalSessions = result.totalSessions ?? undefined;
    dto.createdAt = result.createdAt.toISOString();
    if ('subject' in result) {
      dto.subject = result.subject ?? undefined;
    }
    if ('grade' in result) {
      dto.grade = result.grade ?? undefined;
    }
    if ('bids' in result) {
      dto.bids = result.bids.map((b) => ({
        ...b,
        createdAt: b.createdAt.toISOString(),
        updatedAt: b.updatedAt.toISOString(),
      }));
    }
    return dto;
  }
}

export const AcceptTutorBidResponseSchema = TutorBidResponseSchema.extend({
  requestStatus: z.enum(['OPEN', 'CLOSED', 'CANCELLED']).meta({
    example: 'CLOSED',
    description: 'Updated request status after accepting the bid',
  }),
  bookingId: z.string().meta({
    example: 'clxbooking00000123456789',
    description: 'The created booking ID after accepting the bid',
  }),
}).meta({ id: 'AcceptTutorBidResponseDto' });

export class AcceptTutorBidResponseDto extends createZodDto(
  AcceptTutorBidResponseSchema,
) {
  static fromResult(result: AcceptTutorBidResult): AcceptTutorBidResponseDto {
    const dto = new AcceptTutorBidResponseDto();
    dto.id = result.id;
    dto.requestId = result.requestId;
    dto.tutorId = result.tutorId;
    dto.proposedPrice = result.proposedPrice;
    dto.message = result.message;
    dto.status = result.status;
    dto.requestStatus = result.requestStatus;
    dto.createdAt = result.createdAt.toISOString();
    dto.updatedAt = result.updatedAt.toISOString();
    dto.bookingId = result.bookingId;
    return dto;
  }
}
