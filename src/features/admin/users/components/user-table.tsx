"use client";

import { useState } from "react";
import { DataTable } from "@/src/shared/components/organisms/table/data-table";
import { useGetUsersQuery } from "@/src/features/user/userApi";
import { userColumns } from "./user-columns";
import { UserFilters } from "./user-filters";
import { Loader2 } from "lucide-react";
import { useDebounce } from "@/src/shared/hooks/use-debounce";

export function UserTable() {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [isActive, setIsActive] = useState("all");

  const queryIsActive =
    isActive === "active" ? true : isActive === "banned" ? false : undefined;

  const { data, isLoading, isError } = useGetUsersQuery({
    limit: 100, // Fetch up to 100 users so that client-side pagination works for most cases
    search: debouncedSearch || undefined,
    isActive: queryIsActive,
  });

  const users = data?.data ?? [];
  const total = data?.meta?.total ?? 0;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
        <span className="ml-2 text-muted-foreground">
          Đang tải danh sách...
        </span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-error">
          Không thể tải danh sách người dùng. Vui lòng thử lại.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-lg font-bold">
        Danh sách người dùng ({total})
      </h2>
      <DataTable
        columns={userColumns}
        data={users}
        toolbar={() => (
          <UserFilters
            search={search}
            onSearchChange={setSearch}
            isActive={isActive}
            onIsActiveChange={setIsActive}
          />
        )}
      />
    </div>
  );
}
