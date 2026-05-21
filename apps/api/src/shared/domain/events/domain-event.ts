export interface DomainEvent {
  readonly eventName: string;
  readonly occurredAt: Date;
}

export abstract class BaseDomainEvent implements DomainEvent {
  readonly occurredAt: Date;

  constructor(readonly eventName: string) {
    this.occurredAt = new Date();
  }
}
