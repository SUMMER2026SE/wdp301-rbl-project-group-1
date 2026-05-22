import { AdminHeader, AdminSidebar } from "@/src/features/admin/layout/components";
import {
  SidebarInset,
  SidebarProvider,
} from "@/src/shared/components/ui/sidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset className="h-screen min-w-0 overflow-hidden bg-background font-sans text-foreground">
        <AdminHeader />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
