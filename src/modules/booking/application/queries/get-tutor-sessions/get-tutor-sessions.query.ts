export class GetTutorSessionsQuery {
  constructor(
    public readonly tutorId: string,
    public readonly query: {
      startDate?: string;
      endDate?: string;
    },
  ) {}
}
