"use client";

import { SearchBox } from "@/src/shared/components/molecules/search-box/search-box";
import { SortSelect } from "@/src/shared/components/molecules/sort-select/sort-select";

interface UserFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  isActive: string;
  onIsActiveChange: (value: string) => void;
}

export function UserFilters({
  search,
  onSearchChange,
  isActive,
  onIsActiveChange,
}: UserFiltersProps) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between pb-4">
      <div className="w-full md:max-w-96">
        <SearchBox
          placeholder="Tìm kiếm theo email người dùng..."
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
        />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <SortSelect
          label="Trạng thái:"
          placeholder="Trạng thái"
          value={isActive}
          onChange={onIsActiveChange}
          options={[
            { value: "all", label: "Tất cả trạng thái" },
            { value: "active", label: "Hoạt động" },
            { value: "banned", label: "Bị khóa" },
          ]}
        />
      </div>
    </div>
  );
}
