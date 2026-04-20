import Link from "next/link";

import { NotificationPopover } from "@/src/shared/components/molecules/notification-popover/notification-popover";
import SearchBox from "@/src/shared/components/molecules/search-box/search-box";
import { UserPopover } from "@/src/shared/components/molecules/user-popover/user-popover";
import NavigationBar from "@/src/shared/components/organisms/navigation-bar/navigation-bar";
import { STUDENT_NAV_LINKS } from "./constants/constants";

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const navLinks = STUDENT_NAV_LINKS;

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <header className="sticky top-0 z-50 border-b border-border bg-background px-4 py-3 shadow-sm sm:px-10">
        <div className="flex items-center gap-4">
          <NavigationBar
            menu={navLinks}
            brand={
              <Link href="/student/home" className="flex items-center gap-4">
                <h2 className="text-xl font-bold leading-tight tracking-tight text-foreground">
                  Edura
                </h2>
              </Link>
            }
          />
          <div className="ml-auto hidden shrink-0 items-center gap-6 md:flex">
            <div className="relative min-w-40">
              <SearchBox />
            </div>
            <NotificationPopover />
            <div className="flex items-center gap-4 border-l border-border pl-6">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-foreground">Minh Hoàng</p>
                <p className="text-xs text-muted-foreground">Học sinh lớp 12</p>
              </div>
              <UserPopover />
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1">{children}</main>
    </div>
  );
}
