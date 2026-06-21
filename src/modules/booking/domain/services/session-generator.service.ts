import { Injectable } from '@nestjs/common';
import { SessionStatus } from '../../../../shared/domain/enums/enums';

export interface ScheduleRuleInput {
  dayOfWeek: number;
  startTime: string; // HH:mm
  endTime: string; // HH:mm
}

export interface GeneratedSession {
  startTime: Date;
  endTime: Date;
  order: number;
  status: SessionStatus;
}

@Injectable()
export class SessionGeneratorService {
  /**
   * Generate `totalSessions` sessions starting from `startDate` (or today if null),
   * matching the given `scheduleRules`.
   */
  static generateSessions(
    totalSessions: number,
    scheduleRules: ScheduleRuleInput[],
    startDate: Date = new Date(),
  ): GeneratedSession[] {
    const sessions: GeneratedSession[] = [];
    if (totalSessions <= 0 || !scheduleRules || scheduleRules.length === 0) {
      return sessions;
    }

    // Sort rules by dayOfWeek and startTime to process them in order
    const sortedRules = [...scheduleRules].sort((a, b) => {
      if (a.dayOfWeek !== b.dayOfWeek) return a.dayOfWeek - b.dayOfWeek;
      return a.startTime.localeCompare(b.startTime);
    });

    // We start searching from `startDate`
    const currentDate = new Date(startDate);
    // Reset time to 00:00:00 to avoid time shift issues during day matching
    currentDate.setHours(0, 0, 0, 0);

    let sessionCount = 0;

    // Loop until we have generated `totalSessions` sessions
    while (sessionCount < totalSessions) {
      const currentDayOfWeek = currentDate.getDay(); // 0 is Sunday, 6 is Saturday

      // Find all rules that match the current day of the week
      const matchedRules = sortedRules.filter(
        (rule) => rule.dayOfWeek === currentDayOfWeek,
      );

      for (const rule of matchedRules) {
        if (sessionCount >= totalSessions) break;

        const [startHour, startMinute] = rule.startTime.split(':').map(Number);
        const [endHour, endMinute] = rule.endTime.split(':').map(Number);

        const sessionStart = new Date(currentDate);
        sessionStart.setHours(startHour, startMinute, 0, 0);

        // If the start time is already in the past compared to the exact startDate requested
        if (sessionStart < startDate && sessions.length === 0) {
          continue; // Skip this rule if we're on the first day and it's already past the requested start time
        }

        const sessionEnd = new Date(currentDate);
        sessionEnd.setHours(endHour, endMinute, 0, 0);

        sessions.push({
          startTime: sessionStart,
          endTime: sessionEnd,
          order: sessionCount + 1,
          status: SessionStatus.SCHEDULED,
        });

        sessionCount++;
      }

      // Move to the next day
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return sessions;
  }

  /**
   * Calculate total booking price based on generated sessions.
   * Total Price = Hourly Rate * Total Duration (in hours)
   * Falls back to assuming 1 hour per session if no sessions are generated.
   */
  static calculateBookingPrice(
    hourlyRate: number,
    generatedSessions: GeneratedSession[],
    totalSessions: number,
  ): number {
    if (generatedSessions.length > 0) {
      let totalDurationMs = 0;
      for (const session of generatedSessions) {
        totalDurationMs +=
          session.endTime.getTime() - session.startTime.getTime();
      }

      const totalDurationHours = totalDurationMs / (1000 * 60 * 60);

      if (totalDurationHours > 0) {
        return hourlyRate * totalDurationHours;
      }
    }

    // Fallback: assume 1 hour per session
    return hourlyRate * Math.max(1, totalSessions);
  }
}
