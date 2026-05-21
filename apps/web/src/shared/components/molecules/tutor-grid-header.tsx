"use client";

import { SortSelect } from "./sort-select";

interface TutorGridHeaderProps {
  totalCount: number;
  sortBy: string;
  onSortChange: (value: string) => void;
}

export function TutorGridHeader({
  totalCount,
  sortBy,
  onSortChange,
}: TutorGridHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      <p className="text-muted-foreground text-sm">
        Tìm thấy <span className="font-bold text-foreground">{totalCount}</span>{" "}
        gia sư
      </p>
      <SortSelect value={sortBy} onChange={onSortChange} />
    </div>
  );
}
