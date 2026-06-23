import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';
import {
  DisputeCreatedEvent,
  DisputeResolvedEvent,
} from '../../../dispute/domain/events/dispute-events';
import { NotificationService } from '../services/notification.service';
import { NotificationGateway } from '../../presentation/gateways/notification.gateway';
import { NotificationType } from '../../../../shared/domain/enums/enums';

@EventsHandler(DisputeCreatedEvent, DisputeResolvedEvent)
export class DisputeEventsHandler implements IEventHandler<
  DisputeCreatedEvent | DisputeResolvedEvent
> {
  private readonly logger = new Logger(DisputeEventsHandler.name);

  constructor(
    private readonly notificationService: NotificationService,
    private readonly notificationGateway: NotificationGateway,
  ) {}

  async handle(event: DisputeCreatedEvent | DisputeResolvedEvent) {
    if (event instanceof DisputeCreatedEvent) {
      await this.handleDisputeCreated(event);
    } else if (event instanceof DisputeResolvedEvent) {
      await this.handleDisputeResolved(event);
    }
  }

  private async handleDisputeCreated(event: DisputeCreatedEvent) {
    this.logger.log(
      `Handling DisputeCreatedEvent for ticket ${event.ticketId}`,
    );
    const notification = await this.notificationService.create({
      title: 'Có khiếu nại mới',
      content: `Có một khiếu nại liên quan đến bạn: ${event.reason}`,
      body: { ticketId: event.ticketId, reporterId: event.reporterId },
      type: NotificationType.SYSTEM,
      recipientIds: [event.targetId],
    });
    this.notificationGateway.broadcastNotification(
      [event.targetId],
      notification,
    );
  }

  private async handleDisputeResolved(event: DisputeResolvedEvent) {
    this.logger.log(
      `Handling DisputeResolvedEvent for ticket ${event.ticketId}`,
    );
    const notification = await this.notificationService.create({
      title: 'Khiếu nại đã được giải quyết',
      content: `Khiếu nại của bạn đã được giải quyết với kết quả: ${event.resolution}.`,
      body: { ticketId: event.ticketId, refundAmount: event.refundAmount },
      type: NotificationType.SYSTEM,
      recipientIds: [event.reporterId, event.targetId],
    });
    this.notificationGateway.broadcastNotification(
      [event.reporterId, event.targetId],
      notification,
    );
  }
}
