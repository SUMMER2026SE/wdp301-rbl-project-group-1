import {
  RequestStatus,
  TutoringMode,
} from '../../../../../shared/domain/enums/enums';

export class CreateTutorRequestResult {
  constructor(
    public readonly id: string,
    public readonly studentId: string,
    public readonly subjectId: string | null,
    public readonly title: string,
    public readonly description: string,
    public readonly mode: TutoringMode,
    public readonly budget: number | null,
    public readonly status: RequestStatus,
    public readonly totalSessions: number | null,
    public readonly createdAt: Date,
  ) {}
}
