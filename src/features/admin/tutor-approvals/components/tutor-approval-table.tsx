"use client";

import { DataTable } from "@/src/shared/components/organisms/table/data-table";
import { tutorApprovalColumns } from "./tutor-approval-columns";
import { TutorApprovalFilters } from "./tutor-approval-filters";
import { tutorApplications } from "./tutor-approvals.constants";

export function TutorApprovalTable() {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-lg font-bold">Hàng đợi phê duyệt (12)</h2>
      <DataTable
        columns={tutorApprovalColumns}
        data={tutorApplications}
        toolbar={(table) => <TutorApprovalFilters table={table} />}
      />
    </div>
  );
}
