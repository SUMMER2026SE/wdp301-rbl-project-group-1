import { UserTable } from "@/src/features/admin/users/components";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Quản lý Người dùng",
  description: "Quản lý tài khoản người dùng, phân quyền và khóa tài khoản",
};

export default function UsersPage() {
  return (
    <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-6 p-4 sm:p-6">
      <UserTable />
    </div>
  );
}
