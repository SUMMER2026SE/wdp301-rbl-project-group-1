import { Inject, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ICommand } from '../../../../../shared/application/interfaces/use-case.interface';
import { BookingStatus } from '../../../../../shared/domain/enums/enums';
import { IBookingRepository } from '../../../domain/repositories/booking.repository.interface';
import { AcceptBookingCommand } from './accept-booking.command';
import { AcceptBookingResult } from './accept-booking.result';
import { EventBus } from '@nestjs/cqrs';
import { BookingAcceptedEvent } from '../../../domain/events/booking-events';

@CommandHandler(AcceptBookingCommand)
export class AcceptBookingHandler
  implements
    ICommandHandler<AcceptBookingCommand>,
    ICommand<AcceptBookingCommand, AcceptBookingResult>
{
  constructor(
    @Inject(IBookingRepository)
    private readonly bookingRepository: IBookingRepository,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: AcceptBookingCommand): Promise<AcceptBookingResult> {
    const booking = await this.bookingRepository.updateStatus(
      command.bookingId,
      command.tutorId,
      BookingStatus.PENDING,
      BookingStatus.AWAITING_PAYMENT,
    );

    if (!booking) {
      throw new NotFoundException(
        `Pending booking with id ${command.bookingId} not found`,
      );
    }

    this.eventBus.publish(
      new BookingAcceptedEvent(booking.id, booking.studentId, booking.tutorId),
    );

    return new AcceptBookingResult(booking.id, booking.status);
  }
}
