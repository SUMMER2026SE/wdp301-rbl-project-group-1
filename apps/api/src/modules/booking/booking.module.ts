import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { AcceptBookingHandler } from './application/commands/accept-booking/accept-booking.handler';
import { CreateDirectBookingHandler } from './application/commands/create-direct-booking/create-direct-booking.handler';
import { RejectBookingHandler } from './application/commands/reject-booking/reject-booking.handler';
import { TakeAttendanceHandler } from './application/commands/take-attendance/take-attendance.handler';
import { ApproveRescheduleSessionHandler } from './application/commands/approve-reschedule-session/approve-reschedule-session.handler';
import { RescheduleSessionHandler } from './application/commands/reschedule-session/reschedule-session.handler';
import { RejectRescheduleSessionHandler } from './application/commands/reject-reschedule-session/reject-reschedule-session.handler';
import { CancelSessionHandler } from './application/commands/cancel-session/cancel-session.handler';
import { IBookingRepository } from './domain/repositories/booking.repository.interface';
import { PrismaBookingRepository } from './infrastructure/repositories/booking.repository.impl';
import {
  BookingController,
  BookingSessionController,
} from './presentation/controllers/booking.controller';

import { GetBookingByIdHandler } from './application/queries/get-booking-by-id/get-booking-by-id.handler';
import { GetBookingsQueryHandler } from './application/queries/get-bookings/get-bookings.handler';
import { GetMySessionsHandler } from './application/queries/get-my-sessions/get-my-sessions.handler';
import { GetTutorSessionsHandler } from './application/queries/get-tutor-sessions/get-tutor-sessions.handler';

import { BookingPaymentConfirmedHandler } from './application/event-handlers/payment-confirmed.handler';
import { ConfirmSessionAttendanceHandler } from './application/commands/confirm-session-attendance/confirm-session-attendance.handler';
import { RenewBookingHandler } from './application/commands/renew-booking/renew-booking.handler';
import { MeetingModule } from '../meeting/meeting.module';

const CommandHandlers = [
  CreateDirectBookingHandler,
  AcceptBookingHandler,
  RejectBookingHandler,
  TakeAttendanceHandler,
  ConfirmSessionAttendanceHandler,
  RescheduleSessionHandler,
  ApproveRescheduleSessionHandler,
  RejectRescheduleSessionHandler,
  CancelSessionHandler,
  RenewBookingHandler,
];

const QueryHandlers = [
  GetBookingsQueryHandler,
  GetBookingByIdHandler,
  GetMySessionsHandler,
  GetTutorSessionsHandler,
];

const EventHandlers = [BookingPaymentConfirmedHandler];

@Module({
  imports: [CqrsModule, MeetingModule],
  controllers: [BookingController, BookingSessionController],
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
