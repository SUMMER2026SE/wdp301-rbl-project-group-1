import { BaseDomainEvent } from '../../../../shared/domain/events/domain-event';

export class TutorCreatedDomainEvent extends BaseDomainEvent {
  constructor(public readonly tutorId: string) {
    super(TutorCreatedDomainEvent.name);
  }
}
