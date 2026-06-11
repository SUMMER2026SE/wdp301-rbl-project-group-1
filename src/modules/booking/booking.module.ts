import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { CreateDirectBookingHandler } from './application/commands/create-direct-booking/create-direct-booking.handler';
import { AcceptBookingHandler } from './application/commands/accept-booking/accept-booking.handler';
import { RejectBookingHandler } from './application/commands/reject-booking/reject-booking.handler';
import { TakeAttendanceHandler } from './application/commands/take-attendance/take-attendance.handler';
import { RescheduleSessionHandler } from './application/commands/reschedule-session/reschedule-session.handler';
import { IBookingRepository } from './domain/repositories/booking.repository.interface';
import { PrismaBookingRepository } from './infrastructure/repositories/booking.repository.impl';
import { BookingController } from './presentation/controllers/booking.controller';

import { GetBookingsQueryHandler } from './application/queries/get-bookings/get-bookings.handler';
import { GetBookingByIdHandler } from './application/queries/get-booking-by-id/get-booking-by-id.handler';
import { GetMySessionsHandler } from './application/queries/get-my-sessions/get-my-sessions.handler';
import { GetTutorSessionsHandler } from './application/queries/get-tutor-sessions/get-tutor-sessions.handler';

import { MarkSessionAttendanceHandler } from './application/commands/mark-session-attendance/mark-session-attendance.handler';

import { BookingPaymentConfirmedHandler } from './application/event-handlers/payment-confirmed.handler';

const CommandHandlers = [
  CreateDirectBookingHandler,
  AcceptBookingHandler,
  RejectBookingHandler,
  TakeAttendanceHandler,
  MarkSessionAttendanceHandler,
  RescheduleSessionHandler,
];

const QueryHandlers = [
  GetBookingsQueryHandler,
  GetBookingByIdHandler,
  GetMySessionsHandler,
  GetTutorSessionsHandler,
];

const EventHandlers = [BookingPaymentConfirmedHandler];

@Module({
  imports: [CqrsModule],
  controllers: [BookingController],
  providers: [
    ...CommandHandlers,
    ...QueryHandlers,
    ...EventHandlers,
    {
      provide: IBookingRepository,
      useClass: PrismaBookingRepository,
    },
  ],
  exports: [IBookingRepository],
})
export class BookingModule {}
