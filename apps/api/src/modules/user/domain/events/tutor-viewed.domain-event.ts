export class TutorViewedDomainEvent {
  constructor(
    public readonly viewerId: string,
    public readonly tutorId: string,
  ) {}
}
