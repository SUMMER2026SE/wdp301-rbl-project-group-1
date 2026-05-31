export type ScheduleAvailabilitySlotResult = {
  id: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  createdAt: string;
  updatedAt: string;
};

export type GetScheduleAvailabilityResult = {
  userId: string;
  availability: ScheduleAvailabilitySlotResult[];
};
