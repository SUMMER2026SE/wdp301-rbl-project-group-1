"use client";

import { Button } from "@/src/shared/components/ui/button";
import { Input } from "@/src/shared/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/shared/components/ui/select";
import { Trash2 } from "lucide-react";
import { Schedule, daysOfWeek } from "../types";

interface ScheduleRowProps {
  schedule: Schedule;
  onUpdate: (id: string, field: keyof Schedule, value: string) => void;
  onDelete: (id: string) => void;
}

export function ScheduleRow({
  schedule,
  onUpdate,
  onDelete,
}: ScheduleRowProps) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
      <Select
        value={schedule.dayOfWeek}
        onValueChange={(value) => onUpdate(schedule.id, "dayOfWeek", value)}
      >
        <SelectTrigger className="rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-[#0f1720] px-3 py-1.5 text-sm text-slate-900 dark:text-white outline-none cursor-pointer w-[148px] shrink-0">
          <SelectValue placeholder="Chọn ngày" />
        </SelectTrigger>
        <SelectContent>
          {daysOfWeek.map((day) => (
            <SelectItem key={day.value} value={day.value}>
              {day.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="flex items-center gap-2">
        <Input
          className="w-[140px] rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-[#0f1720] px-3 py-1.5 text-sm text-slate-900 dark:text-white outline-none"
          type="time"
          value={schedule.startTime}
          onChange={(e) => onUpdate(schedule.id, "startTime", e.target.value)}
          aria-label="Giờ bắt đầu"
        />
        <span className="text-slate-500">-</span>
        <Input
          className="w-[140px] rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-[#0f1720] px-3 py-1.5 text-sm text-slate-900 dark:text-white outline-none"
          type="time"
          value={schedule.endTime}
          onChange={(e) => onUpdate(schedule.id, "endTime", e.target.value)}
          aria-label="Giờ kết thúc"
        />
      </div>

      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={() => onDelete(schedule.id)}
        className="text-slate-400 hover:text-red-500 transition-colors shrink-0"
      >
        <Trash2 className="size-4" />
      </Button>
    </div>
  );
}
