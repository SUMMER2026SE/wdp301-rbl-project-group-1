"use client";

import { Button } from "@/src/shared/components/ui/button";
import { Card, CardContent } from "@/src/shared/components/ui/card";
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  startOfMonth,
  startOfWeek,
  subMonths,
} from "date-fns";
import { vi } from "date-fns/locale";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

const WEEKDAYS_SHORT = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];

const LEGEND_DOT_CLASSES: Record<"blue" | "purple" | "emerald" | "orange", string> = {
  blue: "bg-schedule-blue-text",
  purple: "bg-schedule-purple-text",
  emerald: "bg-schedule-emerald-text",
  orange: "bg-schedule-orange-text",
};

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

interface ScheduleCalendarProps {
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
}

export function ScheduleCalendar({
  classes,
  selectedFilter,
  classColorMap,
  onClassClick,
  legendItems,
  getClassesForDate,
  filterClasses,
}: ScheduleCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date(2023, 9, 1)); // Oct 2023 from design
  const [view, setView] = useState<"month" | "week">("month");

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
  const calendarDays = eachDayOfInterval({
    start: calendarStart,
    end: calendarEnd,
  });

  const goToPreviousMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const goToNextMonth = () => setCurrentDate(addMonths(currentDate, 1));

  const filteredClasses = filterClasses
    ? filterClasses(classes, selectedFilter)
    : classes;

  return (
    <Card className="flex flex-col">
      {/* Calendar Header */}
      <div className="border-b border-border flex justify-between items-center p-5">
        <div className="flex items-center gap-4">
          <Button
            onClick={goToPreviousMonth}
            variant="ghost"
            size="sm"
            className="text-muted-foreground"
          >
            <ChevronLeft className="size-5" />
          </Button>
          <h3 className="text-lg font-bold text-foreground">
            {format(currentDate, "MMMM, yyyy", { locale: vi })}
          </h3>
          <Button
            onClick={goToNextMonth}
            variant="ghost"
            size="sm"
            className="text-muted-foreground"
          >
            <ChevronRight className="size-5" />
          </Button>
        </div>
        <div className="flex rounded-lg p-1 gap-1 bg-muted">
          <Button
            onClick={() => setView("month")}
            variant={view === "month" ? "default" : "ghost"}
            size="sm"
            className={
              view === "month"
                ? "bg-card text-foreground shadow-none"
                : "text-muted-foreground"
            }
          >
            Tháng
          </Button>
          <Button
            onClick={() => setView("week")}
            variant={view === "week" ? "default" : "ghost"}
            size="sm"
            className={
              view === "week"
                ? "bg-card text-foreground shadow-none"
                : "text-muted-foreground"
            }
          >
            Tuần
          </Button>
        </div>
      </div>

      {/* Calendar Grid */}
      <CardContent className="p-5 flex-1">
        <div className="grid grid-cols-7 gap-px rounded-lg overflow-hidden border border-border bg-muted">
          {/* Weekday Headers */}
          {WEEKDAYS_SHORT.map((day) => (
            <div
              key={day}
              className="py-2 text-center text-xs font-semibold bg-card text-muted-foreground"
            >
              {day}
            </div>
          ))}

          {/* Calendar Days */}
          {calendarDays.map((day) => {
            const dayClasses = getClassesForDate(day, filteredClasses);
            const isCurrentMonth = isSameMonth(day, currentDate);
            const isToday = isSameDay(day, new Date());
            const dayNumber = day.getDate();

            return (
              <div
                key={day.toISOString()}
                className="min-h-25 p-2 flex flex-col gap-1 border-r border-b border-border bg-background"
              >
                <span
                  className={`text-sm font-medium self-end ${
                    isCurrentMonth && isToday
                      ? "bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center"
                      : isCurrentMonth
                        ? "text-foreground"
                        : "text-muted-foreground"
                  }`}
                >
                  {dayNumber}
                </span>
                <div className="flex flex-col gap-1">
                  {dayClasses.map((cls) => {
                    const colorStyle = classColorMap[cls.color];
                    return (
                      <div
                        key={`${day.toISOString()}-${cls.id}`}
                        onClick={() => onClassClick?.(cls)}
                        className={`${colorStyle.bg} border ${colorStyle.border} rounded p-1 text-xs truncate cursor-pointer hover:opacity-80 transition-opacity group`}
                      >
                        <span className={`font-semibold ${colorStyle.text}`}>
                          {cls.time}
                        </span>
                        <span
                          className={`${colorStyle.text} ml-1 truncate block`}
                        >
                          {cls.name}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        {legendItems && legendItems.length > 0 && (
          <div className="p-5 border-t border-border flex flex-wrap gap-4 justify-center text-xs text-muted-foreground">
            {legendItems.map((item) => (
              <div key={item.color} className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${LEGEND_DOT_CLASSES[item.color]}`} />
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
