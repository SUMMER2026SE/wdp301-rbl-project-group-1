import { BaseDomainEvent } from '../../../../shared/domain/events/domain-event';

export class CourseCreatedDomainEvent extends BaseDomainEvent {
  constructor(public readonly courseId: string) {
    super(CourseCreatedDomainEvent.name);
  }
}
