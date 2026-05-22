import { Avatar, AvatarFallback } from "@/src/shared/components/ui/avatar";
import { Button } from "@/src/shared/components/ui/button";
import { SidebarTrigger } from "@/src/shared/components/ui/sidebar";
import { Bell, ShieldCheck } from "lucide-react";

export function AdminHeader() {
  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-border bg-card px-4 shadow-sm sm:px-6">
      <div className="flex min-w-0 items-center gap-3">
        <SidebarTrigger className="md:hidden" />
        <div className="min-w-0">
          <h2 className="truncate text-lg font-bold text-foreground sm:text-xl">
            Bảng điều khiển Admin Tổng lực
          </h2>
          <p className="hidden text-xs text-muted-foreground sm:block">
            Theo dõi phê duyệt, giao dịch và vận hành trung tâm
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" className="relative text-muted-foreground">
          <Bell className="size-5" />
          <span className="absolute right-2 top-2 size-2 rounded-full bg-destructive" />
        </Button>

        <div className="flex items-center gap-3 border-l border-border pl-3">
          <div className="hidden text-right sm:block">
            <p className="text-sm font-semibold text-foreground">Admin Edura</p>
            <p className="text-xs text-muted-foreground">Quản trị viên</p>
          </div>
          <Avatar>
            <AvatarFallback className="bg-primary/10 text-primary">
              <ShieldCheck className="size-5" />
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}
