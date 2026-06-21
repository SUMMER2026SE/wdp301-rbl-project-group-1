import { createZodDto } from 'nestjs-zod';
import { z } from '../../../../shared/infrastructure/documentation/zod/zod';
import { MySessionResultData } from '../../application/queries/get-my-sessions/get-my-sessions.result';

export const SessionResponseSchema = z
  .object({
    id: z.string(),
    bookingId: z.string().nullable(),
    groupId: z.string().nullable().optional(),
    tutorRequestId: z.string().nullable(),
    title: z.string().nullable(),
    startTime: z.string().datetime(),
    endTime: z.string().datetime(),
    status: z.enum([
      'SCHEDULED',
      'COMPLETED',
      'CANCELLED',
      'AWAITING_CONFIRMATION',
    ]),
    meetingUrl: z.string().nullable(),
    notes: z.string().nullable(),
    order: z.number().nullable(),
    createdAt: z.string().datetime(),

    counterpartName: z.string(),
    subjectName: z.string(),
    subjectId: z.string(),

    proposedStartTime: z.string().datetime().nullable().optional(),
    proposedEndTime: z.string().datetime().nullable().optional(),
    proposedReason: z.string().nullable().optional(),
    rescheduleRequestedBy: z.string().nullable().optional(),
    isRescheduled: z.boolean().default(false),
  })
  .meta({ id: 'SessionResponseDto' });

export class SessionResponseDto extends createZodDto(SessionResponseSchema) {
  static fromResult(result: MySessionResultData): SessionResponseDto {
    const dto = new SessionResponseDto();
    dto.id = result.id;
    dto.bookingId = result.bookingId;
    dto.groupId = result.groupId;
    dto.tutorRequestId = result.tutorRequestId;
    dto.title = result.title;
    dto.startTime = result.startTime.toISOString();
    dto.endTime = result.endTime.toISOString();
    dto.status = result.status as
      | 'SCHEDULED'
      | 'COMPLETED'
      | 'CANCELLED'
      | 'AWAITING_CONFIRMATION';
    dto.meetingUrl = result.meetingUrl;
    dto.notes = result.notes;
    dto.order = result.order;
    dto.createdAt = result.createdAt.toISOString();

    dto.counterpartName = result.counterpartName;
    dto.subjectName = result.subjectName;
    dto.subjectId = result.subjectId;

    dto.proposedStartTime = result.proposedStartTime?.toISOString();
    dto.proposedEndTime = result.proposedEndTime?.toISOString();
    dto.proposedReason = result.proposedReason;
    dto.rescheduleRequestedBy = result.rescheduleRequestedBy;
    dto.isRescheduled = result.isRescheduled;

    return dto;
  }
}
