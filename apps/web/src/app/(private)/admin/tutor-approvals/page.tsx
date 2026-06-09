import { TutorApprovalTable } from "@/src/features/admin/tutor-approvals/components";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Phê duyệt Gia sư",
  description: "Quản lý hồ sơ gia sư chờ phê duyệt",
};

export default function TutorApprovalsPage() {
  return (
    <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-6 p-4 sm:p-6">
      <TutorApprovalTable />
    </div>
  );
}
