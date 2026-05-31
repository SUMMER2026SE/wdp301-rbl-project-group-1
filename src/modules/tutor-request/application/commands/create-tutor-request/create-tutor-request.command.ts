import { TutoringMode } from '../../../../../shared/domain/enums/enums';
import { ScheduleRuleInput } from '../../../domain/entities/tutor-request.entity';

export class CreateTutorRequestCommand {
  constructor(
    public readonly studentId: string,
    public readonly title: string,
    public readonly description: string,
    public readonly mode: TutoringMode,
    public readonly subjectId?: string,
    public readonly budget?: number,
    public readonly scheduleRules?: ScheduleRuleInput[],
  ) {}
}
