import { ScheduleAvailabilitySlotInput } from '../../../domain/repositories/schedule-availability.repository.interface';

export class UpdateScheduleAvailabilityCommand {
  constructor(
    public readonly userId: string,
    public readonly availability: ScheduleAvailabilitySlotInput[],
  ) {}
}
