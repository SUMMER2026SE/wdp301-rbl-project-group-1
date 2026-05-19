import { Inject } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { IMessageBroker } from '../../../../shared/application/interfaces/message-broker.interface';
import { EnrollmentCreatedDomainEvent } from '../../domain/events/enrollment-created.domain-event';
import { EVENTS } from '../../../../shared/application/constants/events.constants';

@EventsHandler(EnrollmentCreatedDomainEvent)
export class SyncEnrollmentToRabbitMqHandler
  implements IEventHandler<EnrollmentCreatedDomainEvent>
{
  constructor(
    @Inject(IMessageBroker) private readonly messageBroker: IMessageBroker,
  ) {}

  async handle(event: EnrollmentCreatedDomainEvent) {
    await this.messageBroker.publishEvent(EVENTS.INTERACTION_LOGGED, {
      userId: event.studentId,
      itemId: event.courseId,
      interactionType: 'ENROLL',
      value: 1.0, // Highest weight for enrollment
    });
  }
}
