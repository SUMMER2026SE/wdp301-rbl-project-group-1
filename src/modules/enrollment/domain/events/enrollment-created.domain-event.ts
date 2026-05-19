import { BaseDomainEvent } from '../../../../shared/domain/events/domain-event';

export class EnrollmentCreatedDomainEvent extends BaseDomainEvent {
  constructor(
    public readonly enrollmentId: string,
    public readonly studentId: string,
    public readonly courseId: string,
  ) {
    super(EnrollmentCreatedDomainEvent.name);
  }
}
