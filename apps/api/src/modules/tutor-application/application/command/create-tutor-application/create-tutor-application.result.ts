import { TutorApplicationStatus } from '../../../domain/enums/tutor-application';

export class CreateTutorApplicationResult {
  constructor(
    public readonly id: string,
    public readonly status: TutorApplicationStatus,
    public readonly createdAt: Date,
  ) {}
}
