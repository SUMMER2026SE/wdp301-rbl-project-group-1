"use client";

import {
  ScheduleHeader as SharedScheduleHeader,
} from "@/src/shared/components/molecules/schedule-sidebar/schedule-header";
import { availableClasses } from "@/src/features/schedule/utils/schedule-ui";
import { ClassFilter } from "../types";

interface ScheduleHeaderProps {
  onClassFilterChange: (filter: ClassFilter) => void;
  selectedFilter: ClassFilter;
}

export function ScheduleHeader({
  onClassFilterChange,
  selectedFilter,
}: ScheduleHeaderProps) {
  return (
    <SharedScheduleHeader
      title="Lịch học tổng hợp"
      description="Xem lịch học của tất cả các lớp"
      selectedFilter={selectedFilter}
      filterOptions={availableClasses}
      onFilterChange={onClassFilterChange}
    />
  );
}
