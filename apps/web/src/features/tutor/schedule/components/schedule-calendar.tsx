"use client";

import { ScheduleCalendar as SharedScheduleCalendar } from "@/src/shared/components/organisms/schedule-calendar/schedule-calendar";
import { classColorMap, getClassesForDate } from "../mock-data";
import { ClassFilter, ScheduleClass } from "../types";

interface ScheduleCalendarProps {
  classes: ScheduleClass[];
  selectedFilter: ClassFilter;
  onClassClick?: (cls: ScheduleClass) => void;
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
}: ScheduleCalendarProps) {
  return (
    <SharedScheduleCalendar
      classes={classes}
      selectedFilter={selectedFilter}
      classColorMap={classColorMap}
      onClassClick={onClassClick}
      legendItems={TUTOR_LEGEND_ITEMS}
      getClassesForDate={getClassesForDate}
      filterClasses={filterClasses}
    />
  );
}
