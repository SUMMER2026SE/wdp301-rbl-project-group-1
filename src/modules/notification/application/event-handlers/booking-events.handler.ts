import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';
import {
  BookingCreatedEvent,
  BookingAcceptedEvent,
  BookingRejectedEvent,
} from '../../../booking/domain/events/booking-events';
import { NotificationService } from '../services/notification.service';
import { NotificationGateway } from '../../presentation/gateways/notification.gateway';
import { NotificationType } from '../../../../shared/domain/enums/enums';

@EventsHandler(BookingCreatedEvent, BookingAcceptedEvent, BookingRejectedEvent)
export class BookingEventsHandler implements IEventHandler<
  BookingCreatedEvent | BookingAcceptedEvent | BookingRejectedEvent
> {
  private readonly logger = new Logger(BookingEventsHandler.name);

  constructor(
    private readonly notificationService: NotificationService,
    private readonly notificationGateway: NotificationGateway,
  ) {}

  async handle(
    event: BookingCreatedEvent | BookingAcceptedEvent | BookingRejectedEvent,
  ) {
    if (event instanceof BookingCreatedEvent) {
      await this.handleBookingCreated(event);
    } else if (event instanceof BookingAcceptedEvent) {
      await this.handleBookingAccepted(event);
    } else if (event instanceof BookingRejectedEvent) {
      await this.handleBookingRejected(event);
    }
  }

  private async handleBookingCreated(event: BookingCreatedEvent) {
    this.logger.log(
      `Handling BookingCreatedEvent for booking ${event.bookingId}`,
    );
    const notification = await this.notificationService.create({
      title: 'Yêu cầu học kèm mới',
      content: `Bạn nhận được một yêu cầu học kèm mới.`,
      body: { bookingId: event.bookingId, studentId: event.studentId },
      type: NotificationType.BOOKING,
      recipientIds: [event.tutorId],
    });
    this.notificationGateway.broadcastNotification(
      [event.tutorId],
      notification,
    );
  }

  private async handleBookingAccepted(event: BookingAcceptedEvent) {
    this.logger.log(
      `Handling BookingAcceptedEvent for booking ${event.bookingId}`,
    );
    const notification = await this.notificationService.create({
      title: 'Yêu cầu học kèm đã được chấp nhận',
      content: `Gia sư đã chấp nhận yêu cầu học kèm của bạn. Vui lòng thanh toán để xác nhận.`,
      body: { bookingId: event.bookingId, tutorId: event.tutorId },
      type: NotificationType.BOOKING,
      recipientIds: [event.studentId],
    });
    this.notificationGateway.broadcastNotification(
      [event.studentId],
      notification,
    );
  }

  private async handleBookingRejected(event: BookingRejectedEvent) {
    this.logger.log(
      `Handling BookingRejectedEvent for booking ${event.bookingId}`,
    );
    const notification = await this.notificationService.create({
      title: 'Yêu cầu học kèm bị từ chối',
      content: `Gia sư đã từ chối yêu cầu học kèm của bạn.`,
      body: { bookingId: event.bookingId, tutorId: event.tutorId },
      type: NotificationType.BOOKING,
      recipientIds: [event.studentId],
    });
    this.notificationGateway.broadcastNotification(
      [event.studentId],
      notification,
    );
  }
}
