import { ReportsBoard } from "@/src/features/admin/reports/components";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Báo cáo & Khiếu nại",
  description: "Quản lý báo cáo và khiếu nại trong hệ thống",
};

export default function ReportsPage() {
  return <ReportsBoard />;
}
