"use client";

import {
  ScheduleCalendar,
  type ScheduleClass,
} from "@/src/shared/components/organisms/schedule-calendar/schedule-calendar";
import { Button } from "@/src/shared/components/ui/button";
import { format, isSameDay } from "date-fns";
import { vi } from "date-fns/locale";
import { Info, Pencil, Plus, X } from "lucide-react";
import { useState } from "react";

export interface ScheduleEvent {
  id: string;
  title: string;
  date: Date;
  time: string;
  endTime?: string;
  description?: string;
  color?: "blue" | "orange";
}

export interface FixedSchedule {
  id: string;
  day: string;
  time: string;
  dayOfWeek: string;
}

export interface UpcomingEvent {
  id: string;
  date: string;
  time: string;
  title: string;
  note?: string;
  teacher?: string;
  status?: "happening" | "changed" | "missed";
}

interface ScheduleProps {
  events: ScheduleEvent[];
  fixedSchedule: FixedSchedule[];
  upcomingEvents: UpcomingEvent[];
  onEditFixedSchedule?: (schedule: FixedSchedule) => void;
  onAddSlot?: () => void;
  onCancelClass?: (eventId: string) => void;
  onEventClick?: (event: ScheduleEvent) => void;
}

// classColorMap for course events (subset of shared color palette)
const COURSE_COLOR_MAP: Record<
  string,
  { bg: string; border: string; text: string }
> = {
  blue: {
    bg: "bg-primary/10",
    border: "border-primary/20",
    text: "text-primary",
  },
  orange: {
    bg: "bg-orange-100 dark:bg-orange-900/30",
    border: "border-orange-200 dark:border-orange-800",
    text: "text-orange-700 dark:text-orange-400",
  },
};

const getStatusColor = (status?: string) => {
  switch (status) {
    case "happening":
      return "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400";
    case "missed":
      return "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400";
    case "changed":
      return "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-400";
    default:
      return "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-400";
  }
};

const getStatusLabel = (status?: string) => {
  switch (status) {
    case "happening":
      return "Sắp diễn ra";
    case "missed":
      return "Hủy buổi";
    case "changed":
      return "Thay đổi";
    default:
      return "";
  }
};

export function Schedule({
  events,
  fixedSchedule,
  upcomingEvents,
  onEditFixedSchedule,
  onAddSlot,
  onCancelClass,
  onEventClick,
}: ScheduleProps) {
  const [selectedEvent, setSelectedEvent] = useState<ScheduleEvent | null>(
    null,
  );

  // Adapter: ScheduleEvent[] → ScheduleClass[] for shared ScheduleCalendar
  const adaptedClasses: ScheduleClass[] = events.map((e) => ({
    id: e.id,
    name: e.title,
    subject: e.title,
    time: e.time,
    endTime: e.endTime ?? "",
    color: (e.color ?? "blue") as "blue" | "orange",
    dateStr: format(e.date, "yyyy-MM-dd"),
  }));

  // getClassesForDate: looks up original event.date via id
  const getClassesForDate = (
    date: Date,
    allClasses: ScheduleClass[],
  ): ScheduleClass[] =>
    allClasses.filter((cls) => {
      const original = events.find((e) => e.id === cls.id);
      return original ? isSameDay(original.date, date) : false;
    });

  // Custom chip: renders endTime + selection ring, not available in default shared chip
  const renderEvent = (cls: ScheduleClass, isCurrentMonth: boolean) => {
    const colorStyle = COURSE_COLOR_MAP[cls.color ?? "blue"];
    const isSelected = selectedEvent?.id === cls.id;
    return (
      <button
        type="button"
        onClick={() => {
          const original = events.find((e) => e.id === cls.id);
          if (original) {
            setSelectedEvent(original);
            onEventClick?.(original);
          }
        }}
        className={[
          "w-full text-left rounded p-1.5 text-xs transition-all hover:shadow-md",
          "border",
          colorStyle.bg,
          colorStyle.border,
          colorStyle.text,
          !isCurrentMonth && "opacity-60",
          isSelected && "ring-2 ring-primary ring-offset-1",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        <div className="font-semibold">{cls.time}</div>
        <div className="truncate">{cls.name}</div>
        {cls.endTime && (
          <div className="text-[10px] opacity-75">đến {cls.endTime}</div>
        )}
      </button>
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Calendar Section — uses shared ScheduleCalendar with event adapter */}
      <div className="lg:col-span-2 flex flex-col gap-8">
        <ScheduleCalendar
          classes={adaptedClasses}
          selectedFilter="all"
          classColorMap={COURSE_COLOR_MAP}
          getClassesForDate={getClassesForDate}
          renderEvent={renderEvent}
        />

        {/* Selected Event Detail */}
        {selectedEvent && (
          <div className="rounded-xl border border-primary/30 dark:border-primary/50 bg-primary/5 dark:bg-primary/10 overflow-hidden">
            <div className="p-4 border-b border-primary/20 dark:border-primary/30 bg-primary/10 dark:bg-primary/20">
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Chi tiết buổi học
                </h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSelectedEvent(null)}
                  className="text-slate-500"
                >
                  <X className="size-4" />
                </Button>
              </div>
            </div>
            <div className="p-4 space-y-3">
              <div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                  Tiêu đề
                </div>
                <div className="font-semibold text-slate-900 dark:text-white">
                  {selectedEvent.title}
                </div>
              </div>
              <div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                  Thời gian
                </div>
                <div className="font-medium text-slate-900 dark:text-white">
                  {format(selectedEvent.date, "dd/MM/yyyy", { locale: vi })} •{" "}
                  {selectedEvent.time}
                  {selectedEvent.endTime && ` - ${selectedEvent.endTime}`}
                </div>
              </div>
              {selectedEvent.description && (
                <div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                    Mô tả
                  </div>
                  <div className="text-sm text-slate-700 dark:text-slate-300">
                    {selectedEvent.description}
                  </div>
                </div>
              )}
              <div className="flex gap-2 pt-2">
                <Button
                  className="flex-1 bg-primary hover:bg-blue-600 text-white text-sm"
                  size="sm"
                >
                  Chỉnh sửa
                </Button>
                <Button
                  variant="secondary"
                  className="flex-1 text-sm"
                  size="sm"
                >
                  Hủy buổi học
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Info Section */}
        <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-blue-50 dark:bg-blue-900/10 p-4 flex gap-3">
          <div className="size-6 rounded-full bg-primary flex items-center justify-center text-white shrink-0">
            <Info className="size-3.5" />
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-slate-900 dark:text-white mb-1">
              Thông báo biến động lịch
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Hệ thống sẽ tự động gửi email và thông báo ứng dụng cho học sinh
              khi bạn thực hiện các thay đổi về lịch học.
            </p>
          </div>
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="flex flex-col gap-8">
        {/* Fixed Schedule */}
        <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 overflow-hidden">
          <div className="p-5 border-b border-slate-200 dark:border-slate-800">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Lịch học cố định
            </h3>
          </div>
          <div className="p-5 space-y-3">
            {fixedSchedule.map((schedule) => (
              <div
                key={schedule.id}
                className="flex items-center justify-between p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50"
              >
                <div>
                  <div className="font-semibold text-slate-900 dark:text-white text-sm">
                    {schedule.day} {schedule.time}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    {schedule.dayOfWeek}
                  </div>
                </div>
                {onEditFixedSchedule && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEditFixedSchedule(schedule)}
                    className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                  >
                    <Pencil className="size-4" />
                  </Button>
                )}
              </div>
            ))}
            {onAddSlot && (
              <Button
                variant="outline"
                onClick={onAddSlot}
                className="w-full flex items-center justify-center gap-2 p-3 h-auto rounded-lg border-2 border-dashed border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-primary hover:text-primary"
              >
                <Plus className="size-5" />
                <span className="text-sm font-medium">Thêm khung giờ</span>
              </Button>
            )}
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 overflow-hidden">
          <div className="p-5 border-b border-slate-200 dark:border-slate-800">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Sắp tới
            </h3>
          </div>
          <div className="p-5 space-y-4">
            {upcomingEvents.map((event) => (
              <div
                key={event.id}
                className="p-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="font-bold text-slate-900 dark:text-white">
                      {event.date}
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">
                      {event.time}
                    </div>
                  </div>
                  {event.status && (
                    <span
                      className={`text-xs font-semibold px-2 py-1 rounded ${getStatusColor(event.status)}`}
                    >
                      {getStatusLabel(event.status)}
                    </span>
                  )}
                </div>
                <div className="text-sm text-slate-700 dark:text-slate-300 mb-1">
                  {event.title}
                </div>
                {event.note && (
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    {event.note}
                  </div>
                )}
                {event.teacher && (
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    {event.teacher}
                  </div>
                )}
                {onCancelClass && (
                  <Button
                    variant="link"
                    size="sm"
                    className="text-xs text-blue-600 dark:text-blue-400 p-0 h-auto mt-2"
                  >
                    Thay đổi
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
