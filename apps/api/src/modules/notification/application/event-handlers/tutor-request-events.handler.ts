import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';
import {
  TutorRequestCreatedEvent,
  BidPlacedEvent,
  BidAcceptedEvent,
} from '../../../tutor-request/domain/events/tutor-request-events';
import { NotificationService } from '../services/notification.service';
import { NotificationGateway } from '../../presentation/gateways/notification.gateway';
import { NotificationType } from '../../../../shared/domain/enums/enums';

@EventsHandler(TutorRequestCreatedEvent, BidPlacedEvent, BidAcceptedEvent)
export class TutorRequestEventsHandler implements IEventHandler<
  TutorRequestCreatedEvent | BidPlacedEvent | BidAcceptedEvent
> {
  private readonly logger = new Logger(TutorRequestEventsHandler.name);

  constructor(
    private readonly notificationService: NotificationService,
    private readonly notificationGateway: NotificationGateway,
  ) {}

  async handle(
    event: TutorRequestCreatedEvent | BidPlacedEvent | BidAcceptedEvent,
  ) {
    if (event instanceof TutorRequestCreatedEvent) {
      this.handleTutorRequestCreated(event);
    } else if (event instanceof BidPlacedEvent) {
      await this.handleBidPlaced(event);
    } else if (event instanceof BidAcceptedEvent) {
      await this.handleBidAccepted(event);
    }
  }

  private handleTutorRequestCreated(event: TutorRequestCreatedEvent) {
    this.logger.log(
      `Handling TutorRequestCreatedEvent for request ${event.requestId}`,
    );
    // Note: Broadcasting to all tutors is complex. Usually done via system message or topics.
    // For now, we skip pushing to all tutors individually to avoid massive loop unless required.
  }

  private async handleBidPlaced(event: BidPlacedEvent) {
    this.logger.log(`Handling BidPlacedEvent for bid ${event.bidId}`);
    const notification = await this.notificationService.create({
      title: 'Có gia sư mới ứng tuyển',
      content: `Một gia sư đã ứng tuyển cho yêu cầu tìm gia sư của bạn.`,
      body: {
        requestId: event.requestId,
        bidId: event.bidId,
        tutorId: event.tutorId,
      },
      type: NotificationType.SYSTEM,
      recipientIds: [event.studentId],
    });
    this.notificationGateway.broadcastNotification(
      [event.studentId],
      notification,
    );
  }

  private async handleBidAccepted(event: BidAcceptedEvent) {
    this.logger.log(`Handling BidAcceptedEvent for bid ${event.bidId}`);
    const notification = await this.notificationService.create({
      title: 'Ứng tuyển thành công',
      content: `Học sinh đã chấp nhận yêu cầu dạy kèm của bạn.`,
      body: {
        requestId: event.requestId,
        bidId: event.bidId,
        studentId: event.studentId,
      },
      type: NotificationType.SYSTEM,
      recipientIds: [event.tutorId],
    });
    this.notificationGateway.broadcastNotification(
      [event.tutorId],
      notification,
    );
  }
}
