import { createZodDto } from 'nestjs-zod';
import { z } from '../../../../shared/infrastructure/documentation/zod/zod';
import { AcceptBookingResult } from '../../application/commands/accept-booking/accept-booking.result';
import { RejectBookingResult } from '../../application/commands/reject-booking/reject-booking.result';

export const BookingStatusUpdateResponseSchema = z
  .object({
    bookingId: z.string().meta({
      example: 'clxbooking00000123456789',
      description: 'Booking ID',
    }),
    status: z.enum(['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED']).meta({
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
