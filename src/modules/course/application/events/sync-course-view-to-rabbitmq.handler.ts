import { Inject } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { IMessageBroker } from '../../../../shared/application/interfaces/message-broker.interface';
import { EVENTS } from '../../../../shared/application/constants/events.constants';
import { CourseViewedDomainEvent } from '../../domain/events/course-viewed.domain-event';

@EventsHandler(CourseViewedDomainEvent)
export class SyncCourseViewToRabbitMqHandler implements IEventHandler<CourseViewedDomainEvent> {
  constructor(
    @Inject(IMessageBroker) private readonly messageBroker: IMessageBroker,
  ) {}

  async handle(event: CourseViewedDomainEvent) {
    await this.messageBroker.publishEvent(EVENTS.INTERACTION_LOGGED, {
      userId: event.userId,
      itemId: event.courseId,
      itemType: 'COURSE',
      interactionType: 'VIEW',
      value: 1.0,
    });
  }
}
