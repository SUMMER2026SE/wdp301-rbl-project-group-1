"use client";

import { Button } from "@/src/shared/components/ui/button";
import { Card, CardContent } from "@/src/shared/components/ui/card";
import {
  addWeeks,
  eachDayOfInterval,
  endOfWeek,
  format,
  isSameDay,
  startOfWeek,
  subWeeks,
} from "date-fns";
import { vi } from "date-fns/locale";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

export type {
  ClassFilter,
  ScheduleCalendarProps,
  ScheduleClass,
  ScheduleMode,
} from "./types";

import { LEGEND_DOT_CLASSES, SESSION_CONFIG, WEEKDAYS_SHORT } from "./constants";
import { ScheduleCalendarProps, SessionType } from "./types";
import {
  doesEventOverlapSession,
  generateActiveTimeSlots,
  getRelativeEventPosition,
} from "./utils";

export function ScheduleCalendar({
  mode = "weekly",
  classes,
  selectedFilter,
  classColorMap,
  onClassClick,
  legendItems,
  getClassesForDate,
  filterClasses,
  renderEvent,
  onSlotClick,
  initialAvailableSlots,
  onAvailableSlotsChange,
  readonly = false,
  variant = "availability",
  tutorAvailableSlots,
}: ScheduleCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [availableSlots, setAvailableSlots] = useState<Record<string, boolean>>(
    initialAvailableSlots || {},
  );
  const [session, setSession] = useState<SessionType>("morning");

  const calendarStart = startOfWeek(currentDate, { weekStartsOn: 1 });
  const calendarEnd = endOfWeek(currentDate, { weekStartsOn: 1 });
  const calendarDays = eachDayOfInterval({
    start: calendarStart,
    end: calendarEnd,
  });

  const goToPreviousWeek = () => setCurrentDate(subWeeks(currentDate, 1));
  const goToNextWeek = () => setCurrentDate(addWeeks(currentDate, 1));

  const filteredClasses = filterClasses
    ? filterClasses(classes, selectedFilter)
    : classes;

  const toggleSlot = (day: Date, time: string, dayIndex: number) => {
    const slotKey =
      mode === "fixed"
        ? `${dayIndex}_${time}`
        : `${format(day, "yyyy-MM-dd")}_${time}`;

    const newSlots = {
      ...availableSlots,
      [slotKey]: !availableSlots[slotKey],
    };

    setAvailableSlots(newSlots);

    if (onAvailableSlotsChange) {
      onAvailableSlotsChange(newSlots);
    }

    if (onSlotClick) {
      onSlotClick(mode === "fixed" ? undefined : day, time, dayIndex);
    }
  };

  const currentSessionConfig = SESSION_CONFIG[session];
  const activeTimeSlots = generateActiveTimeSlots(
    currentSessionConfig.startHour,
    currentSessionConfig.slotsCount,
  );

  return (
    <Card className="flex flex-col">
      {/* Calendar Header */}
      <div className="border-b border-border flex justify-between items-center p-5">
        <div className="flex items-center gap-4">
          {mode === "weekly" ? (
            <>
              <Button
                type="button"
                onClick={goToPreviousWeek}
                variant="ghost"
                size="sm"
                className="text-muted-foreground"
              >
                <ChevronLeft className="size-5" />
              </Button>
              <h3 className="text-lg font-bold text-foreground capitalize w-32 text-center">
                {format(calendarStart, "MMMM, yyyy", { locale: vi })}
              </h3>
              <Button
                type="button"
                onClick={goToNextWeek}
                variant="ghost"
                size="sm"
                className="text-muted-foreground"
              >
                <ChevronRight className="size-5" />
              </Button>
            </>
          ) : (
            <h3 className="text-lg font-bold text-foreground capitalize">
              Lịch cố định
            </h3>
          )}
        </div>
        <div className="flex rounded-lg p-1 gap-1 bg-muted">
          {(Object.keys(SESSION_CONFIG) as SessionType[]).map((s) => (
            <Button
              key={s}
              type="button"
              onClick={() => setSession(s)}
              variant={session === s ? "default" : "ghost"}
              size="sm"
              className={
                session === s
                  ? "bg-card text-foreground shadow-sm px-4"
                  : "text-muted-foreground px-4 hover:bg-muted-foreground/10"
              }
            >
              <span className="font-medium">{SESSION_CONFIG[s].label}</span>
              <span className="ml-2 hidden sm:inline text-xs opacity-70">
                {SESSION_CONFIG[s].timeRange}
              </span>
            </Button>
          ))}
        </div>
      </div>

      {/* Calendar Grid */}
      <CardContent className="p-0 flex-1 overflow-x-auto">
        <div className="min-w-[800px] flex flex-col">
          {/* Weekday Headers */}
          <div className="flex border-b border-border bg-muted/20">
            <div className="w-16 flex-shrink-0 border-r border-border" />
            {calendarDays.map((day, idx) => {
              const isToday = mode === "weekly" && isSameDay(day, new Date());
              return (
                <div
                  key={day.toISOString()}
                  className="flex-1 py-3 text-center border-r border-border last:border-r-0 flex flex-col items-center justify-center gap-1"
                >
                  <span className="text-xs font-semibold text-muted-foreground uppercase">
                    {WEEKDAYS_SHORT[idx]}
                  </span>
                  {mode === "weekly" && (
                    <span
                      className={`text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full ${
                        isToday
                          ? "bg-primary text-primary-foreground"
                          : "text-foreground"
                      }`}
                    >
                      {day.getDate()}
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Timetable Body */}
          <div className="flex relative bg-background pb-5">
            {/* Time labels column */}
            <div className="w-16 flex-shrink-0 border-r border-border bg-muted/10 relative">
              {activeTimeSlots.map((time, idx) => (
                <div
                  key={time}
                  className="h-12 border-b border-border border-dashed flex items-start justify-end pr-2 pt-1"
                >
                  <span className="text-[10px] text-muted-foreground font-medium -mt-3 bg-muted/10 px-1 rounded">
                    {idx % 2 === 0 ? time : ""}
                  </span>
                </div>
              ))}
            </div>

            {/* Days columns */}
            {calendarDays.map((day, idx) => {
              const dayClasses = (getClassesForDate(day, filteredClasses) || []).filter(Boolean);
              const visibleClasses = dayClasses.filter((cls) =>
                doesEventOverlapSession(
                  cls.time,
                  cls.endTime || "23:00",
                  currentSessionConfig.startHour,
                  currentSessionConfig.slotsCount,
                ),
              );

              return (
                <div
                  key={day.toISOString()}
                  className="flex-1 flex flex-col min-w-[100px] border-r border-border last:border-r-0 relative group"
                >
                  {/* Background cells for toggling (fixed) or display (weekly) */}
                  {activeTimeSlots.map((time) => {
                    const slotKey =
                      mode === "fixed"
                        ? `${idx}_${time}`
                        : `${format(day, "yyyy-MM-dd")}_${time}`;
                    let bgClass = "bg-background";
                    let isClickable = false;

                    if (mode === "fixed") {
                      const isTutorAvailable = tutorAvailableSlots ? tutorAvailableSlots[slotKey] : true;
                      const isSelected = availableSlots[slotKey];

                      if (!isTutorAvailable) {
                        bgClass = "bg-muted/30 bg-[repeating-linear-gradient(45deg,rgba(0,0,0,0.04),rgba(0,0,0,0.04)_4px,transparent_4px,transparent_8px)] dark:bg-[repeating-linear-gradient(45deg,rgba(255,255,255,0.04),rgba(255,255,255,0.04)_4px,transparent_4px,transparent_8px)]";
                        isClickable = false;
                      } else {
                        isClickable = true;
                        if (variant === "booking") {
                          bgClass = isSelected ? "bg-primary/20" : "bg-background";
                        } else {
                          bgClass = isSelected 
                            ? "bg-background" 
                            : "bg-muted/30 bg-[repeating-linear-gradient(45deg,rgba(0,0,0,0.04),rgba(0,0,0,0.04)_4px,transparent_4px,transparent_8px)] dark:bg-[repeating-linear-gradient(45deg,rgba(255,255,255,0.04),rgba(255,255,255,0.04)_4px,transparent_4px,transparent_8px)]";
                        }
                      }
                    }

                    return (
                      <motion.div
                        key={time}
                        onClick={() => {
                          if (mode === "fixed" && !readonly && isClickable) toggleSlot(day, time, idx);
                        }}
                        whileHover={isClickable && mode === "fixed" && !readonly ? { scale: 0.98, zIndex: 10 } : {}}
                        whileTap={isClickable && mode === "fixed" && !readonly ? { scale: 0.95 } : {}}
                        transition={{ type: "spring", stiffness: 400, damping: 25 }}
                        className={`h-12 border-b border-border border-dashed transition-colors ${
                          mode === "fixed" && !readonly && isClickable ? "cursor-pointer" : ""
                        } ${bgClass}`}
                        style={{ originX: 0.5, originY: 0.5 }}
                      />
                    );
                  })}

                  {/* Events overlay (usually not populated in fixed mode unless passed in) */}
                  {visibleClasses.map((cls) => {
                    const { top, height } = getRelativeEventPosition(
                      cls.time,
                      cls.endTime || "23:00",
                      currentSessionConfig.startHour,
                      currentSessionConfig.slotsCount,
                    );
                    const colorStyle =
                      classColorMap[cls.color] || classColorMap["blue"];

                    if (renderEvent) {
                      return (
                        <div
                          key={`${day.toISOString()}-${cls.id}`}
                          className="absolute left-1 right-1 z-10"
                          style={{ top: `${top}%`, height: `${height}%` }}
                        >
                          {renderEvent(cls, true)}
                        </div>
                      );
                    }

                    return (
                      <div
                        key={`${day.toISOString()}-${cls.id}`}
                        onClick={() => onClassClick?.(cls)}
                        className={`absolute left-1 right-1 ${colorStyle.bg} border ${colorStyle.border} rounded p-1.5 text-xs overflow-hidden cursor-pointer shadow-sm hover:shadow-md transition-all z-10 flex flex-col gap-0.5`}
                        style={{ top: `${top}%`, height: `${height}%` }}
                      >
                        <div
                          className={`font-semibold ${colorStyle.text} leading-tight`}
                        >
                          {cls.time} - {cls.endTime}
                        </div>
                        <div
                          className={`truncate ${colorStyle.text} font-medium leading-tight`}
                        >
                          {cls.name}
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>

        {/* Legend */}
        <div className="p-4 border-t border-border flex flex-wrap gap-4 justify-center text-xs text-muted-foreground bg-card">
          {mode === "fixed" && (
            <>
              <div className="flex items-center gap-2 mr-4 border-r border-border pr-4">
                <div className="w-3 h-3 rounded border border-border bg-muted/30 bg-[repeating-linear-gradient(45deg,rgba(0,0,0,0.04),rgba(0,0,0,0.04)_2px,transparent_2px,transparent_4px)] dark:bg-[repeating-linear-gradient(45deg,rgba(255,255,255,0.04),rgba(255,255,255,0.04)_2px,transparent_2px,transparent_4px)]" />
                <span>Lịch bận</span>
              </div>
              <div className="flex items-center gap-2 mr-4 border-r border-border pr-4">
                <div className="w-3 h-3 rounded bg-background border border-border border-dashed" />
                <span>Thời gian rảnh</span>
              </div>
            </>
          )}
          {legendItems?.map((item) => (
            <div key={item.color} className="flex items-center gap-2">
              <div
                className={`w-3 h-3 rounded-full ${LEGEND_DOT_CLASSES[item.color]}`}
              />
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
