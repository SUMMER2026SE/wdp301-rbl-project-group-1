import { UserAvailability } from '../entities/user-availability.entity';

export type ScheduleAvailabilitySlotInput = {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
};

export const IScheduleAvailabilityRepository = Symbol(
  'IScheduleAvailabilityRepository',
);

export interface IScheduleAvailabilityRepository {
  findByUserId(userId: string): Promise<UserAvailability[]>;
  replaceForUser(
    userId: string,
    slots: ScheduleAvailabilitySlotInput[],
  ): Promise<UserAvailability[]>;
}
