import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { Logger, Inject } from '@nestjs/common';
import { PaymentConfirmedEvent } from '../../../payment/domain/events/payment-confirmed.event';
import { IMessageBroker } from '../../../../shared/application/interfaces/message-broker.interface';
import { EVENTS } from '../../../../shared/application/constants/events.constants';
import {
  PaymentReferenceType,
  BookingStatus,
} from '../../../../shared/domain/enums/enums';
import { PrismaService } from '../../../../shared/infrastructure/database/prisma/prisma.service';

@EventsHandler(PaymentConfirmedEvent)
export class BookingPaymentConfirmedHandler implements IEventHandler<PaymentConfirmedEvent> {
  private readonly logger = new Logger(BookingPaymentConfirmedHandler.name);

  constructor(
    private readonly prisma: PrismaService,
    @Inject(IMessageBroker) private readonly messageBroker: IMessageBroker,
  ) {}

  async handle(event: PaymentConfirmedEvent) {
    if (event.referenceType !== PaymentReferenceType.TUTOR_BOOKING) {
      return;
    }

    this.logger.log(
      `Handling payment confirmed for booking ${event.referenceId}`,
    );

    try {
      const booking = await this.prisma.booking.findUnique({
        where: { id: event.referenceId },
        include: { subject: true },
      });

      if (!booking) {
        this.logger.error(`Booking not found for ID: ${event.referenceId}`);
        return;
      }

      if (booking.status === (BookingStatus.CONFIRMED as string)) {
        this.logger.warn(`Booking ${event.referenceId} is already confirmed.`);
        return;
      }

      await this.prisma.booking.update({
        where: { id: event.referenceId },
        data: {
          status: BookingStatus.CONFIRMED,
        },
      });

      await this.messageBroker.publishEvent(EVENTS.BOOKING_CREATED, {
        userId: booking.studentId,
        tutorId: booking.tutorId,
        bookingId: booking.id,
        subjectSlug: booking.subject?.slug,
      });

      this.logger.log(
        `Booking ${event.referenceId} successfully updated to CONFIRMED`,
      );
    } catch (error) {
      this.logger.error(
        `Error updating booking ${event.referenceId} status: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }
}
