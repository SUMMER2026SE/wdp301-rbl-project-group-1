"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/src/shared/components/ui/sidebar";
import {
  BookOpen,
  CircleDollarSign,
  FileWarning,
  Home,
  LogOut,
  ScrollText,
  ShieldCheck,
  UserCheck,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const ADMIN_NAV_LINKS = [
  { label: "Tổng quan", href: "/admin", icon: Home },
  {
    label: "Phê duyệt Gia sư",
    href: "/admin/tutor-approvals",
    icon: UserCheck,
  },
  { label: "Quản lý Khóa học", href: "/admin/courses", icon: BookOpen },
  {
    label: "Kiểm duyệt Nội dung",
    href: "/admin/moderation",
    icon: ShieldCheck,
  },
  {
    label: "Giao dịch & Rút tiền",
    href: "/admin/transactions",
    icon: CircleDollarSign,
  },
  { label: "Quản lý Đánh giá", href: "/admin/reviews", icon: ShieldCheck },
  { label: "Báo cáo & Khiếu nại", href: "/admin/reports", icon: FileWarning },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="offcanvas">
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <ScrollText className="size-5" />
          </div>
          <div className="min-w-0">
            <h1 className="truncate text-base font-bold leading-tight text-foreground">
              Hệ thống Quản trị
            </h1>
            <p className="text-xs text-muted-foreground">Trung tâm điều hành</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarSeparator className="mx-0" />

      <SidebarContent className="p-4">
        <SidebarMenu className="gap-1">
          {ADMIN_NAV_LINKS.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  asChild
                  isActive={isActive}
                  className="h-10 gap-3 rounded-lg px-3"
                >
                  <Link href={item.href}>
                    <Icon className="size-5" />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>

      <SidebarSeparator className="mx-0" />

      <SidebarFooter className="p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="h-10 gap-3 rounded-lg px-3">
              <Link href="/login">
                <LogOut className="size-5" />
                <span>Đăng xuất</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
