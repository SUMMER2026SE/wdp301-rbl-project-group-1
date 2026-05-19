import { BaseDomainEvent } from '../../../../shared/domain/events/domain-event';
import { UserRole } from '../../../../shared/domain/enums/enums';

export class UserCreatedDomainEvent extends BaseDomainEvent {
  constructor(
    public readonly userId: string,
    public readonly email: string,
    public readonly nickname: string,
    public readonly role: UserRole,
  ) {
    super(UserCreatedDomainEvent.name);
  }
}
