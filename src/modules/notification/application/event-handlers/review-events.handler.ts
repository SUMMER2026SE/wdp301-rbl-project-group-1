import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';
import { ReviewCreatedEvent } from '../../../review/domain/events/review-events';
import { NotificationService } from '../services/notification.service';
import { NotificationGateway } from '../../presentation/gateways/notification.gateway';
import { NotificationType } from '../../../../shared/domain/enums/enums';

@EventsHandler(ReviewCreatedEvent)
export class ReviewEventsHandler implements IEventHandler<ReviewCreatedEvent> {
  private readonly logger = new Logger(ReviewEventsHandler.name);

  constructor(
    private readonly notificationService: NotificationService,
    private readonly notificationGateway: NotificationGateway,
  ) {}

  async handle(event: ReviewCreatedEvent) {
    this.logger.log(`Handling ReviewCreatedEvent for review ${event.reviewId}`);
    const notification = await this.notificationService.create({
      title: 'Đánh giá mới',
      content: `Học sinh đã để lại một đánh giá ${event.rating} sao cho buổi học của bạn.`,
      body: {
        reviewId: event.reviewId,
        bookingId: event.bookingId,
        studentId: event.studentId,
      },
      type: NotificationType.REVIEW,
      recipientIds: [event.tutorId],
    });
    this.notificationGateway.broadcastNotification(
      [event.tutorId],
      notification,
    );
  }
}
