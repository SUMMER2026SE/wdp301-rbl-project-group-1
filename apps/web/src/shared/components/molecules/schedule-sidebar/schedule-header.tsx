"use client";

import React from "react";
import { Button } from "@/src/shared/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/shared/components/ui/select";
import { Plus } from "lucide-react";

export interface ClassFilterOption {
  value: string;
  label: string;
}

export interface ScheduleHeaderProps {
  title: string;
  description?: string;
  selectedFilter: string;
  filterOptions: ClassFilterOption[];
  onFilterChange: (filter: string) => void;
  /** If provided, renders an "Add schedule" button */
  onNewScheduleClick?: () => void;
}

export function ScheduleHeader({
  title,
  description,
  selectedFilter,
  filterOptions,
  onFilterChange,
  onNewScheduleClick,
}: ScheduleHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 className="text-foreground text-3xl font-black leading-tight tracking-[-0.033em]">
          {title}
        </h1>
        {description && (
          <p className="text-muted-foreground text-base mt-1">{description}</p>
        )}
      </div>
      <div className="flex items-center gap-3">
        <Select value={selectedFilter} onValueChange={onFilterChange}>
          <SelectTrigger className="w-auto" aria-label="Chọn lớp học">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {filterOptions.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {onNewScheduleClick && (
          <Button
            onClick={onNewScheduleClick}
            className="flex items-center gap-2"
          >
            <Plus className="size-4" />
            <span>Lên lịch mới</span>
          </Button>
        )}
      </div>
    </div>
  );
}
