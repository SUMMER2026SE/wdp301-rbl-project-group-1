import { AdminDashboard } from "@/src/features/admin/dashboard/components";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin",
  description: "Bảng điều khiển quản trị Edura",
};

export default function AdminPage() {
  return <AdminDashboard />;
}
