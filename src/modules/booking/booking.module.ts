import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { AcceptBookingHandler } from './application/commands/accept-booking/accept-booking.handler';
import { RejectBookingHandler } from './application/commands/reject-booking/reject-booking.handler';
import { IBookingRepository } from './domain/repositories/booking.repository.interface';
import { PrismaBookingRepository } from './infrastructure/repositories/booking.repository.impl';
import { BookingController } from './presentation/controllers/booking.controller';

const CommandHandlers = [AcceptBookingHandler, RejectBookingHandler];

@Module({
  imports: [CqrsModule],
  controllers: [BookingController],
  providers: [
    ...CommandHandlers,
    {
      provide: IBookingRepository,
      useClass: PrismaBookingRepository,
    },
  ],
  exports: [IBookingRepository],
})
export class BookingModule {}
