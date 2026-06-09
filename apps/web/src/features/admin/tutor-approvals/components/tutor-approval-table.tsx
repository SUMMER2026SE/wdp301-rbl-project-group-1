"use client";

import { DataTable } from "@/src/shared/components/organisms/table/data-table";
import { useGetTutorApplicationsQuery } from "@/src/features/tutor-application/tutorApplicationApi";
import { tutorApprovalColumns } from "./tutor-approval-columns";
import { TutorApprovalFilters } from "./tutor-approval-filters";
import { Loader2 } from "lucide-react";

export function TutorApprovalTable() {
  const { data, isLoading, isError } = useGetTutorApplicationsQuery({
    status: "PENDING",
  });

  const applications = data?.data ?? [];
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
          Không thể tải danh sách đơn ứng tuyển. Vui lòng thử lại.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-lg font-bold">
        Hàng đợi phê duyệt ({total})
      </h2>
      <DataTable
        columns={tutorApprovalColumns}
        data={applications}
        toolbar={(table) => <TutorApprovalFilters table={table} />}
      />
    </div>
  );
}
