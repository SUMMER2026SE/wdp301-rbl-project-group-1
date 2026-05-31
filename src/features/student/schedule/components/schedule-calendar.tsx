"use client";

import {
  ScheduleCalendar as SharedScheduleCalendar,
  ScheduleMode,
} from "@/src/shared/components/organisms/schedule-calendar/schedule-calendar";
import { classColorMap, getClassesForDate, getFixedClassesForDate } from "../mock-data";
import { ClassFilter, ScheduleClass } from "../types";

interface ScheduleCalendarProps {
  classes: ScheduleClass[];
  selectedFilter: ClassFilter;
  onClassClick?: (cls: ScheduleClass) => void;
  mode?: ScheduleMode;
  initialAvailableSlots?: Record<string, boolean>;
  onAvailableSlotsChange?: (slots: Record<string, boolean>) => void;
  readonly?: boolean;
  variant?: "availability" | "booking";
  tutorAvailableSlots?: Record<string, boolean>;
}

const filterClasses = (classes: ScheduleClass[], filter: ClassFilter) => {
  if (filter === "all") return classes;
  return classes.filter((cls) => {
    if (filter === "math10") return cls.subject === "Math";
    if (filter === "physics12") return cls.subject === "Physics";
    if (filter === "chem11") return cls.subject === "Chemistry";
    return true;
  });
};

const STUDENT_LEGEND_ITEMS = [
  { color: "blue" as const, label: "Toán 10 - Nhóm A" },
  { color: "purple" as const, label: "Lý 12 - Kèm 1:1" },
  { color: "emerald" as const, label: "Hóa 11 - Nâng cao" },
];

export function ScheduleCalendar({
  classes,
  selectedFilter,
  onClassClick,
  mode = "weekly",
  initialAvailableSlots,
  onAvailableSlotsChange,
  readonly = false,
  variant,
  tutorAvailableSlots,
}: ScheduleCalendarProps) {
  return (
    <SharedScheduleCalendar
      mode={mode}
      readonly={readonly}
      variant={variant}
      tutorAvailableSlots={tutorAvailableSlots}
      initialAvailableSlots={initialAvailableSlots}
      onAvailableSlotsChange={onAvailableSlotsChange}
      classes={classes}
      selectedFilter={selectedFilter}
      classColorMap={classColorMap}
      onClassClick={onClassClick}
      legendItems={STUDENT_LEGEND_ITEMS}
      getClassesForDate={mode === "fixed" ? getFixedClassesForDate : getClassesForDate}
      filterClasses={filterClasses}
    />
  );
}
