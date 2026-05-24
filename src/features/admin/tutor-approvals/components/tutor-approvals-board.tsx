import { TutorApprovalFilters } from "./tutor-approval-filters";
import { TutorApprovalTable } from "./tutor-approval-table";

export function TutorApprovalsBoard() {
  return (
    <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-6 p-4 sm:p-6">
      <TutorApprovalFilters />
      <TutorApprovalTable />
    </div>
  );
}
