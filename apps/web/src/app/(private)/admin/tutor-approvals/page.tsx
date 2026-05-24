import { TutorApprovalsBoard } from "@/src/features/admin/tutor-approvals/components";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Phê duyệt Gia sư",
  description: "Quản lý hồ sơ gia sư chờ phê duyệt",
};

export default function TutorApprovalsPage() {
  return <TutorApprovalsBoard />;
}
