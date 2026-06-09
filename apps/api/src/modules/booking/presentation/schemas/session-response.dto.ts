import { createZodDto } from 'nestjs-zod';
import { z } from '../../../../shared/infrastructure/documentation/zod/zod';
import { MySessionResultData } from '../../application/queries/get-my-sessions/get-my-sessions.result';

export const SessionResponseSchema = z
  .object({
    id: z.string(),
    bookingId: z.string().nullable(),
    tutorRequestId: z.string().nullable(),
    title: z.string().nullable(),
    startTime: z.string().datetime(),
    endTime: z.string().datetime(),
    status: z.enum(['SCHEDULED', 'COMPLETED', 'CANCELLED']),
    meetingUrl: z.string().nullable(),
    notes: z.string().nullable(),
    order: z.number().nullable(),
    createdAt: z.string().datetime(),

    counterpartName: z.string(),
    subjectName: z.string(),
    subjectId: z.string(),
  })
  .meta({ id: 'SessionResponseDto' });

export class SessionResponseDto extends createZodDto(SessionResponseSchema) {
  static fromResult(result: MySessionResultData): SessionResponseDto {
    const dto = new SessionResponseDto();
    dto.id = result.id;
    dto.bookingId = result.bookingId;
    dto.tutorRequestId = result.tutorRequestId;
    dto.title = result.title;
    dto.startTime = result.startTime.toISOString();
    dto.endTime = result.endTime.toISOString();
    dto.status = result.status as 'SCHEDULED' | 'COMPLETED' | 'CANCELLED';
    dto.meetingUrl = result.meetingUrl;
    dto.notes = result.notes;
    dto.order = result.order;
    dto.createdAt = result.createdAt.toISOString();

    dto.counterpartName = result.counterpartName;
    dto.subjectName = result.subjectName;
    dto.subjectId = result.subjectId;
    return dto;
  }
}
