import { STUDENT_NAV_LINKS } from "@/src/app/(private)/student/constants/constants";
import { NotificationPopover } from "@/src/shared/components/molecules/notification-popover/notification-popover";
import SearchBox from "@/src/shared/components/molecules/search-box/search-box";
import { UserPopover } from "@/src/shared/components/molecules/user-popover/user-popover";
import NavigationBar from "@/src/shared/components/organisms/navigation-bar/navigation-bar";
import { GraduationCap } from "lucide-react";
import Link from "next/link";

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const navLinks = STUDENT_NAV_LINKS;

  return (
    <div className="min-h-screen flex flex-col bg-background dark:bg-background">
      <header className="sticky top-0 z-50 border-b border-border bg-card px-4 py-3 shadow-sm dark:bg-card sm:px-10">
        <div className="flex items-center gap-4">
          <NavigationBar
            menu={navLinks}
            brand={
              <Link href="/student/home" className="flex items-center gap-4">
                <div className="flex size-8 items-center justify-center text-primary dark:text-primary">
                  <GraduationCap className="size-8" />
                </div>
                <h2 className="text-xl font-bold leading-tight tracking-tight text-foreground dark:text-foreground">
                  Edura
                </h2>
              </Link>
            }
          />

          {/* Search, Notifications, User profile - Right side */}
          <div className="ml-auto hidden shrink-0 items-center gap-6 md:flex">
            <div className="relative min-w-40">
              <SearchBox />
            </div>

            {/* Notifications */}
            <NotificationPopover />

            {/* User profile */}
            <div className="flex items-center gap-4 border-l border-border pl-6 dark:border-border">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-foreground dark:text-foreground">
                  Minh Hoàng
                </p>
                <p className="text-xs text-muted-foreground dark:text-muted-foreground">
                  Học sinh lớp 12
                </p>
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
