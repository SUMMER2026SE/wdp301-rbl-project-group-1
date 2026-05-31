import { ReactNode } from "react";

export interface ScheduleClass {
  id: string;
  name: string;
  subject: string;
  tutorName?: string;
  time: string;
  endTime: string;
  color: "blue" | "purple" | "emerald" | "orange";
}

export type ClassFilter = "all" | string;

export type ScheduleMode = "weekly" | "fixed";

export interface ScheduleCalendarProps {
  mode?: ScheduleMode;
  variant?: "availability" | "booking";
  classes: ScheduleClass[];
  selectedFilter: ClassFilter;
  classColorMap: Record<string, { bg: string; border: string; text: string }>;
  onClassClick?: (cls: ScheduleClass) => void;
  legendItems?: Array<{
    color: "blue" | "purple" | "emerald" | "orange";
    label: string;
  }>;
  getClassesForDate: (
    date: Date,
    allClasses: ScheduleClass[],
  ) => ScheduleClass[];
  filterClasses?: (
    classes: ScheduleClass[],
    filter: ClassFilter,
  ) => ScheduleClass[];
  renderEvent?: (
    cls: ScheduleClass,
    isCurrentMonth: boolean,
  ) => ReactNode;
  onSlotClick?: (date: Date | undefined, timeStr: string, dayIndex: number) => void;
  initialAvailableSlots?: Record<string, boolean>;
  tutorAvailableSlots?: Record<string, boolean>;
  onAvailableSlotsChange?: (slots: Record<string, boolean>) => void;
  readonly?: boolean;
}

export type SessionType = "morning" | "afternoon" | "evening";

export interface SessionConfig {
  startHour: number;
  slotsCount: number;
  label: string;
  timeRange: string;
}
