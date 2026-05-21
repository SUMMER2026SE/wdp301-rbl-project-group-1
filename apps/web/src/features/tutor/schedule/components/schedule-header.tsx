"use client";

import {
  ScheduleHeader as SharedScheduleHeader,
} from "@/src/shared/components/molecules/schedule-sidebar/schedule-header";
import { availableClasses } from "../mock-data";
import { ClassFilter } from "../types";

interface ScheduleHeaderProps {
  onClassFilterChange: (filter: ClassFilter) => void;
  onNewScheduleClick: () => void;
  selectedFilter: ClassFilter;
}

export function ScheduleHeader({
  onClassFilterChange,
  onNewScheduleClick,
  selectedFilter,
}: ScheduleHeaderProps) {
  return (
    <SharedScheduleHeader
      title="Lịch dạy Tổng hợp"
      description="Quản lý lịch dạy của tất cả các lớp"
      selectedFilter={selectedFilter}
      filterOptions={availableClasses}
      onFilterChange={onClassFilterChange}
      onNewScheduleClick={onNewScheduleClick}
    />
  );
}
