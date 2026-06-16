import { Inject, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ICommand } from '../../../../../shared/application/interfaces/use-case.interface';
import { BookingStatus } from '../../../../../shared/domain/enums/enums';
import { IBookingRepository } from '../../../domain/repositories/booking.repository.interface';
import { RejectBookingCommand } from './reject-booking.command';
import { RejectBookingResult } from './reject-booking.result';
import { EventBus } from '@nestjs/cqrs';
import { BookingRejectedEvent } from '../../../domain/events/booking-events';

@CommandHandler(RejectBookingCommand)
export class RejectBookingHandler
  implements
    ICommandHandler<RejectBookingCommand>,
    ICommand<RejectBookingCommand, RejectBookingResult>
{
  constructor(
    @Inject(IBookingRepository)
    private readonly bookingRepository: IBookingRepository,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: RejectBookingCommand): Promise<RejectBookingResult> {
    const booking = await this.bookingRepository.updateStatus(
      command.bookingId,
      command.tutorId,
      BookingStatus.PENDING,
      BookingStatus.CANCELLED,
    );

    if (!booking) {
      throw new NotFoundException(
        `Pending booking with id ${command.bookingId} not found`,
      );
    }

    this.eventBus.publish(
      new BookingRejectedEvent(booking.id, booking.studentId, booking.tutorId),
    );

    return new RejectBookingResult(booking.id, booking.status);
  }
}
