"use client";

import { Pagination } from "@/src/shared/components/molecules/pagination/pagination";

export function TutorApprovalsPagination() {
  return (
    <Pagination
      currentPage={1}
      totalPages={3}
      onPageChange={() => undefined}
      className="justify-start sm:justify-end"
    />
  );
}
