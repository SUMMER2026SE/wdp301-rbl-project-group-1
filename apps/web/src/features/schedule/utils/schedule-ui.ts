import { ScheduleClass } from "@/src/shared/components/organisms/schedule-calendar/types";

export const availableClasses = [
  { value: "all", label: "Tất cả lớp học" },
];

export const classColorMap: Record<
  string,
  { bg: string; border: string; text: string }
> = {
  blue: {
    bg: "bg-[color:var(--schedule-blue-light)]",
    border: "border-[color:var(--schedule-blue-border)]",
    text: "text-[color:var(--schedule-blue-text)]",
  },
  purple: {
    bg: "bg-[color:var(--schedule-purple-light)]",
    border: "border-[color:var(--schedule-purple-border)]",
    text: "text-[color:var(--schedule-purple-text)]",
  },
  emerald: {
    bg: "bg-[color:var(--schedule-emerald-light)]",
    border: "border-[color:var(--schedule-emerald-border)]",
    text: "text-[color:var(--schedule-emerald-text)]",
  },
  orange: {
    bg: "bg-[color:var(--schedule-orange-light)]",
    border: "border-[color:var(--schedule-orange-border)]",
    text: "text-[color:var(--schedule-orange-text)]",
  },
};

import { format, parse } from "date-fns";

export const getClassesForDate = (
  date: Date,
  allClasses: ScheduleClass[],
): ScheduleClass[] => {
  const dateStr = format(date, "yyyy-MM-dd");
  return allClasses.filter((cls) => cls.dateStr === dateStr);
};

export const getFixedClassesForDate = (
  date: Date,
  allClasses: ScheduleClass[],
): ScheduleClass[] => {
  const targetDayOfWeek = date.getDay();
  return allClasses.filter((cls) => {
    const clsDate = parse(cls.dateStr, "yyyy-MM-dd", new Date());
    return clsDate.getDay() === targetDayOfWeek;
  });
};
