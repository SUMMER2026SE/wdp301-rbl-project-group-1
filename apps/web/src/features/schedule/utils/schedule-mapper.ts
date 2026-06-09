import { ScheduleAvailabilitySlotResponseDto } from "../scheduleAvailabilityApi";

/**
 * Adds 30 minutes to a "HH:mm" time string.
 */
const add30Mins = (time: string): string => {
  const [h, m] = time.split(":").map(Number);
  const totalMins = h * 60 + m + 30;
  const newH = Math.floor(totalMins / 60);
  const newM = totalMins % 60;
  return `${String(newH).padStart(2, "0")}:${String(newM).padStart(2, "0")}`;
};

/**
 * Maps the API response format (contiguous blocks) to the Calendar Record format (30-min intervals).
 * Also maps backend dayOfWeek (0=Sun) to frontend day index (0=Mon).
 */
export const mapApiToSlots = (
  apiSlots: ScheduleAvailabilitySlotResponseDto[]
): Record<string, boolean> => {
  const slots: Record<string, boolean> = {};

  apiSlots.forEach((slot) => {
    // Backend 0=Sun..6=Sat -> Frontend 0=Mon..6=Sun
    const feIdx = slot.dayOfWeek === 0 ? 6 : slot.dayOfWeek - 1;
    let currentTime = slot.startTime;

    while (currentTime < slot.endTime) {
      slots[`${feIdx}_${currentTime}`] = true;
      currentTime = add30Mins(currentTime);
    }
  });

  return slots;
};

type ApiSlot = { dayOfWeek: number; startTime: string; endTime: string };

/**
 * Maps the Calendar Record format (30-min intervals) back to the contiguous API block format.
 * Also maps frontend day index (0=Mon) to backend dayOfWeek (0=Sun).
 */
export const mapSlotsToApi = (slots: Record<string, boolean>): ApiSlot[] => {
  const apiSlots: ApiSlot[] = [];
  const selectedByDay: Record<number, string[]> = {};

  Object.entries(slots).forEach(([key, isSelected]) => {
    if (!isSelected) return;
    const [idxStr, time] = key.split("_");
    const idx = parseInt(idxStr, 10);
    if (!selectedByDay[idx]) selectedByDay[idx] = [];
    selectedByDay[idx].push(time);
  });

  Object.entries(selectedByDay).forEach(([idxStr, times]) => {
    const idx = parseInt(idxStr, 10);
    // Frontend 0=Mon..6=Sun -> Backend 0=Sun..6=Sat
    const dayOfWeek = idx === 6 ? 0 : idx + 1;

    // Sort times sequentially
    times.sort((a, b) => a.localeCompare(b));

    if (times.length === 0) return;

    let currentStart = times[0];
    let currentEnd = add30Mins(currentStart);

    for (let i = 1; i < times.length; i++) {
      const time = times[i];
      if (time === currentEnd) {
        // Continue contiguous block
        currentEnd = add30Mins(time);
      } else {
        // Gap detected, push current block
        apiSlots.push({ dayOfWeek, startTime: currentStart, endTime: currentEnd });
        currentStart = time;
        currentEnd = add30Mins(currentStart);
      }
    }
    // Push the final block for the day
    apiSlots.push({ dayOfWeek, startTime: currentStart, endTime: currentEnd });
  });

  return apiSlots;
};
