import { createZodDto } from 'nestjs-zod';
import { z } from '../../../../shared/infrastructure/documentation/zod/zod';
import { AcceptBookingResult } from '../../application/commands/accept-booking/accept-booking.result';
import { RejectBookingResult } from '../../application/commands/reject-booking/reject-booking.result';
import { CreateDirectBookingResult } from '../../application/commands/create-direct-booking/create-direct-booking.result';
import { BookingResultData } from '../../application/queries/get-bookings/get-bookings.result';

export const BookingStatusUpdateResponseSchema = z
  .object({
    bookingId: z.string().meta({
      example: 'clxbooking00000123456789',
      description: 'Booking ID',
    }),
    status: z
      .enum([
        'PENDING',
        'AWAITING_PAYMENT',
        'CONFIRMED',
        'COMPLETED',
        'CANCELLED',
      ])
      .meta({
        example: 'CONFIRMED',
        description: 'Updated booking status',
      }),
  })
  .meta({ id: 'BookingStatusUpdateResponseDto' });

export class BookingStatusUpdateResponseDto extends createZodDto(
  BookingStatusUpdateResponseSchema,
) {
  static fromResult(
    result: AcceptBookingResult | RejectBookingResult,
  ): BookingStatusUpdateResponseDto {
    const dto = new BookingStatusUpdateResponseDto();
    dto.bookingId = result.bookingId;
    dto.status = result.status;
    return dto;
  }
}

export const CreateDirectBookingResponseSchema = z
  .object({
    bookingId: z.string().meta({
      example: 'clxbooking00000123456789',
      description: 'Created booking ID',
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
      .meta({
        example: 'PENDING',
      }),
    message: z.string().nullable().meta({ example: 'Cần ôn tập Toán 10' }),
    createdAt: z
      .string()
      .datetime()
      .meta({ example: '2025-01-01T00:00:00.000Z' }),
  })
  .meta({ id: 'CreateDirectBookingResponseDto' });

export class CreateDirectBookingResponseDto extends createZodDto(
  CreateDirectBookingResponseSchema,
) {
  static fromResult(
    result: CreateDirectBookingResult,
  ): CreateDirectBookingResponseDto {
    const dto = new CreateDirectBookingResponseDto();
    dto.bookingId = result.bookingId;
    dto.studentId = result.studentId;
    dto.tutorId = result.tutorId;
    dto.subjectId = result.subjectId;
    dto.mode = result.mode;
    dto.status = result.status;
    dto.message = result.message;
    dto.createdAt = result.createdAt;
    return dto;
  }
}

export const BookingResponseSchema = z
  .object({
    id: z.string(),
    studentId: z.string(),
    tutorId: z.string(),
    subjectId: z.string().nullable(),
    mode: z.enum(['ONLINE', 'AT_HOME']),
    status: z.enum([
      'PENDING',
      'AWAITING_PAYMENT',
      'CONFIRMED',
      'COMPLETED',
      'CANCELLED',
    ]),
    price: z.number().nullable(),
    message: z.string().nullable(),
    createdAt: z.string().datetime(),
    groupId: z.string(),
    groupTotalSessions: z.number().optional(),
    groupStartDate: z.string().datetime().optional(),
    student: z.object({
      id: z.string(),
      nickname: z.string().nullable(),
      avatarUrl: z.string().nullable(),
    }),
    tutor: z.object({
      id: z.string(),
      name: z.string(),
      avatarUrl: z.string().nullable(),
    }),
    subject: z
      .object({
        id: z.string(),
        name: z.string(),
        slug: z.string(),
      })
      .nullable(),
    scheduleRules: z.array(
      z.object({
        dayOfWeek: z.number(),
        startTime: z.string(),
        endTime: z.string(),
      }),
    ),
  })
  .meta({ id: 'BookingResponseDto' });

export class BookingResponseDto extends createZodDto(BookingResponseSchema) {
  static fromResult(result: BookingResultData): BookingResponseDto {
    const dto = new BookingResponseDto();
    dto.id = result.id;
    dto.studentId = result.studentId;
    dto.tutorId = result.tutorId;
    dto.subjectId = result.subjectId;
    dto.mode = result.mode;
    dto.status = result.status;
    dto.price = result.price;
    dto.message = result.message;
    dto.createdAt = result.createdAt.toISOString();
    dto.groupId = result.groupId;
    dto.groupTotalSessions = result.groupTotalSessions;
    dto.groupStartDate = result.groupStartDate?.toISOString();

    dto.student = result.student;
    dto.tutor = result.tutor;
    dto.subject = result.subject;
    dto.scheduleRules = result.scheduleRules;
    return dto;
  }
}
