import { Inject } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { EVENTS } from '../../../../shared/application/constants/events.constants';
import { IMessageBroker } from '../../../../shared/application/interfaces/message-broker.interface';
import { TutorViewedDomainEvent } from '../../domain/events/tutor-viewed.domain-event';

@EventsHandler(TutorViewedDomainEvent)
export class SyncTutorViewToRabbitMqHandler
  implements IEventHandler<TutorViewedDomainEvent>
{
  constructor(
    @Inject(IMessageBroker) private readonly messageBroker: IMessageBroker,
  ) {}

  async handle(event: TutorViewedDomainEvent) {
    await this.messageBroker.publishEvent(EVENTS.INTERACTION_LOGGED, {
      userId: event.viewerId,
      itemId: event.tutorId,
      itemType: 'TUTOR',
      interactionType: 'VIEW',
      value: 1.0,
    });
  }
}
