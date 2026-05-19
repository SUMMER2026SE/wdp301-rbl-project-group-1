import { BaseDomainEvent } from '../../../../shared/domain/events/domain-event';

export class CourseUpdatedDomainEvent extends BaseDomainEvent {
  constructor(public readonly courseId: string) {
    super(CourseUpdatedDomainEvent.name);
  }
}
