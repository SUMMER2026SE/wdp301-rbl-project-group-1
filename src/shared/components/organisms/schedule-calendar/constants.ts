import { SessionConfig, SessionType } from "./types";

export const WEEKDAYS_SHORT = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];

export const LEGEND_DOT_CLASSES: Record<
  "blue" | "purple" | "emerald" | "orange",
  string
> = {
  blue: "bg-schedule-blue-text",
  purple: "bg-schedule-purple-text",
  emerald: "bg-schedule-emerald-text",
  orange: "bg-schedule-orange-text",
};

export const SESSION_CONFIG: Record<SessionType, SessionConfig> = {
  morning: { startHour: 7, slotsCount: 10, label: "Sáng", timeRange: "07:00 - 12:00" },
  afternoon: { startHour: 12, slotsCount: 12, label: "Chiều", timeRange: "12:00 - 18:00" },
  evening: { startHour: 18, slotsCount: 10, label: "Tối", timeRange: "18:00 - 23:00" },
};
