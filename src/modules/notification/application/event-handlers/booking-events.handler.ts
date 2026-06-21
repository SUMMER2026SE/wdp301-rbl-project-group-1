import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';
import {
  BookingCreatedEvent,
  BookingAcceptedEvent,
  BookingRejectedEvent,
  SessionRescheduleRequestedEvent,
  SessionRescheduleApprovedEvent,
  SessionRescheduleRejectedEvent,
} from '../../../booking/domain/events/booking-events';
import { NotificationService } from '../services/notification.service';
import { NotificationGateway } from '../../presentation/gateways/notification.gateway';
import { NotificationType } from '../../../../shared/domain/enums/enums';

@EventsHandler(
  BookingCreatedEvent,
  BookingAcceptedEvent,
  BookingRejectedEvent,
  SessionRescheduleRequestedEvent,
  SessionRescheduleApprovedEvent,
  SessionRescheduleRejectedEvent,
)
export class BookingEventsHandler implements IEventHandler<
  | BookingCreatedEvent
  | BookingAcceptedEvent
  | BookingRejectedEvent
  | SessionRescheduleRequestedEvent
  | SessionRescheduleApprovedEvent
  | SessionRescheduleRejectedEvent
> {
  private readonly logger = new Logger(BookingEventsHandler.name);

  constructor(
    private readonly notificationService: NotificationService,
    private readonly notificationGateway: NotificationGateway,
  ) {}

  async handle(
    event:
      | BookingCreatedEvent
      | BookingAcceptedEvent
      | BookingRejectedEvent
      | SessionRescheduleRequestedEvent
      | SessionRescheduleApprovedEvent
      | SessionRescheduleRejectedEvent,
  ) {
    if (event instanceof BookingCreatedEvent) {
      await this.handleBookingCreated(event);
    } else if (event instanceof BookingAcceptedEvent) {
      await this.handleBookingAccepted(event);
    } else if (event instanceof BookingRejectedEvent) {
      await this.handleBookingRejected(event);
    } else if (event instanceof SessionRescheduleRequestedEvent) {
      await this.handleSessionRescheduleRequested(event);
    } else if (event instanceof SessionRescheduleApprovedEvent) {
      await this.handleSessionRescheduleApproved(event);
    } else if (event instanceof SessionRescheduleRejectedEvent) {
      await this.handleSessionRescheduleRejected(event);
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

  private async handleSessionRescheduleRequested(
    event: SessionRescheduleRequestedEvent,
  ) {
    this.logger.log(
      `Handling SessionRescheduleRequestedEvent for session ${event.sessionId}`,
    );
    const isTutorRequested = event.requestedBy === event.tutorId;
    const recipientId = isTutorRequested ? event.studentId : event.tutorId;
    const content = isTutorRequested
      ? `Gia sư của bạn vừa gửi yêu cầu dời lịch học sang thời gian mới.`
      : `Học viên của bạn vừa gửi yêu cầu dời lịch học sang thời gian mới.`;

    const notification = await this.notificationService.create({
      title: 'Yêu cầu dời lịch học',
      content,
      body: {
        sessionId: event.sessionId,
        studentId: event.studentId,
        tutorId: event.tutorId,
        requestedBy: event.requestedBy,
        newStartTime: event.newStartTime,
      },
      type: NotificationType.BOOKING, // Consider mapping to a more specific type if possible, or stick to BOOKING if UI relies on it.
      recipientIds: [recipientId],
    });
    this.notificationGateway.broadcastNotification([recipientId], notification);
  }

  private async handleSessionRescheduleApproved(
    event: SessionRescheduleApprovedEvent,
  ) {
    this.logger.log(
      `Handling SessionRescheduleApprovedEvent for session ${event.sessionId}`,
    );
    const isTutorApproved = event.approvedBy === event.tutorId;
    const recipientId = isTutorApproved ? event.studentId : event.tutorId;
    const content = isTutorApproved
      ? `Gia sư của bạn đã chấp nhận yêu cầu dời lịch học.`
      : `Học viên của bạn đã chấp nhận yêu cầu dời lịch học.`;

    const notification = await this.notificationService.create({
      title: 'Yêu cầu dời lịch học được chấp nhận',
      content,
      body: {
        sessionId: event.sessionId,
        studentId: event.studentId,
        tutorId: event.tutorId,
        approvedBy: event.approvedBy,
      },
      type: NotificationType.BOOKING,
      recipientIds: [recipientId],
    });
    this.notificationGateway.broadcastNotification([recipientId], notification);
  }

  private async handleSessionRescheduleRejected(
    event: SessionRescheduleRejectedEvent,
  ) {
    this.logger.log(
      `Handling SessionRescheduleRejectedEvent for session ${event.sessionId}`,
    );
    const isTutorRejected = event.rejectedBy === event.tutorId;
    const recipientId = isTutorRejected ? event.studentId : event.tutorId;
    const content = isTutorRejected
      ? `Gia sư của bạn đã từ chối yêu cầu dời lịch học.`
      : `Học viên của bạn đã từ chối yêu cầu dời lịch học.`;

    const notification = await this.notificationService.create({
      title: 'Yêu cầu dời lịch học bị từ chối',
      content,
      body: {
        sessionId: event.sessionId,
        studentId: event.studentId,
        tutorId: event.tutorId,
        rejectedBy: event.rejectedBy,
      },
      type: NotificationType.BOOKING,
      recipientIds: [recipientId],
    });
    this.notificationGateway.broadcastNotification([recipientId], notification);
  }
}
