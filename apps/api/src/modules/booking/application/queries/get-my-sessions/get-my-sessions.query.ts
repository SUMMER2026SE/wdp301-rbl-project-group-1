export class GetMySessionsQuery {
  constructor(
    public readonly userId: string,
    public readonly role: 'STUDENT' | 'TUTOR',
    public readonly query: {
      startDate?: string;
      endDate?: string;
    },
  ) {}
}
