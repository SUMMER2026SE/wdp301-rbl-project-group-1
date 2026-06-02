"use client";

import {
  ScheduleCalendar as SharedScheduleCalendar,
  ScheduleMode,
} from "@/src/shared/components/organisms/schedule-calendar/schedule-calendar";
import { classColorMap, getClassesForDate, getFixedClassesForDate } from "@/src/features/schedule/utils/schedule-ui";
import { ClassFilter, ScheduleClass } from "../types";

interface ScheduleCalendarProps {
  classes: ScheduleClass[];
  selectedFilter: ClassFilter;
  onClassClick?: (cls: ScheduleClass) => void;
  mode?: ScheduleMode;
  initialAvailableSlots?: Record<string, boolean>;
  onAvailableSlotsChange?: (slots: Record<string, boolean>) => void;
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

const TUTOR_LEGEND_ITEMS = [
  { color: "blue" as const, label: "Toán 10 - Nhóm A" },
  { color: "purple" as const, label: "Lý 12 - Kèm 1:1" },
  { color: "emerald" as const, label: "Hóa 11 - Nâng cao" },
  { color: "orange" as const, label: "Học cụ" },
];

export function ScheduleCalendar({
  classes,
  selectedFilter,
  onClassClick,
  mode = "weekly",
  initialAvailableSlots,
  onAvailableSlotsChange,
}: ScheduleCalendarProps) {
  return (
    <SharedScheduleCalendar
      mode={mode}
      initialAvailableSlots={initialAvailableSlots}
      onAvailableSlotsChange={onAvailableSlotsChange}
      classes={classes}
      selectedFilter={selectedFilter}
      classColorMap={classColorMap}
      onClassClick={onClassClick}
      legendItems={TUTOR_LEGEND_ITEMS}
      getClassesForDate={mode === "fixed" ? getFixedClassesForDate : getClassesForDate}
      filterClasses={filterClasses}
    />
  );
}
