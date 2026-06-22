"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { clearAuth } from "@/src/features/auth/authSlice";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { Switch } from "@/src/shared/components/ui/switch";
import { useLogoutMutation } from "@/src/features/auth/authApi";
import { useGetProfileQuery } from "@/src/features/user/userApi";
import { useAppDispatch, useAppSelector } from "@/src/shared/store/hooks";

import { Avatar } from "@/src/shared/components/atoms/avatar/avatar";
import { Button } from "@/src/shared/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/src/shared/components/ui/popover";
import { Separator } from "@/src/shared/components/ui/separator";
import { getSummaryName } from "@/src/shared/utils/common";

export interface PopoverMenuItem {
  href: string;
  label: string;
  iconType: "profile" | "dashboard" | "settings";
}

const ICONS = {
  profile: (
    <svg
      className="size-5 shrink-0 text-muted-foreground"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
      />
    </svg>
  ),
  dashboard: (
    <svg
      className="size-5 shrink-0 text-muted-foreground"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 12l2-3m0 0l7-4 7 4M5 9v10a1 1 0 001 1h12a1 1 0 001-1V9m-9 11l4-4m0 0l4 4m-4-4v4"
      />
    </svg>
  ),
  settings: (
    <svg
      className="size-5 shrink-0 text-muted-foreground"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
      />
    </svg>
  ),
};

interface UserProfilePopoverProps {
  menuItems: PopoverMenuItem[];
  defaultName?: string;
  ariaLabel?: string;
}

export function UserProfilePopover({
  menuItems,
  defaultName = "Người dùng",
  ariaLabel = "Mở menu người dùng",
}: UserProfilePopoverProps) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const { data: profileResponse } = useGetProfileQuery(undefined, {
    skip: !isAuthenticated,
  });

  const userProfile = profileResponse?.data?.profile;
  const displayName = userProfile?.nickname || defaultName;
  const avatarUrl = userProfile?.avatarUrl || undefined;
  const email = profileResponse?.data?.email;
  const initials = getSummaryName(displayName);

  const [logout] = useLogoutMutation();

  const handleLogout = async () => {
    try {
      await logout().unwrap();
    } catch (e: unknown) {
      const error = e as { data?: { message?: string }; status?: number; error?: string };
      console.warn(
        "Logout note:",
        error?.data?.message || error?.status || error?.error || "Session ended",
      );
    } finally {
      dispatch(clearAuth());
      router.push("/login");
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="size-9 rounded-full p-0 ring-offset-background transition-all hover:ring-2 hover:ring-primary/30"
          aria-label={ariaLabel}
        >
          <Avatar
            src={avatarUrl}
            alt={displayName}
            fallback={initials}
            size="sm"
            className="size-9"
          />
        </Button>
      </PopoverTrigger>

      <PopoverContent align="end" className="w-72 p-0">
        <div className="flex items-center gap-3 p-4">
          <Avatar
            src={avatarUrl}
            alt={displayName}
            fallback={initials}
            size="md"
          />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-foreground">
              {displayName}
            </p>
            <p className="truncate text-xs text-muted-foreground">
              {email ?? "Chưa có email"}
            </p>
          </div>
        </div>

        <Separator />

        <div className="flex flex-col py-2">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-4 py-2 text-sm text-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              {ICONS[item.iconType]}
              {item.label}
            </Link>
          ))}
        </div>

        <Separator />

        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3 text-sm text-foreground">
            {theme === "dark" ? <Moon className="size-5 text-muted-foreground" /> : <Sun className="size-5 text-muted-foreground" />}
            <span>Giao diện tối</span>
          </div>
          <Switch 
            checked={theme === "dark"} 
            onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
          />
        </div>

        <Separator />

        <div className="p-2">
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 px-4 text-sm text-destructive hover:bg-destructive/10 hover:text-destructive"
            onClick={handleLogout}
          >
            <svg
              className="size-5 shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            Đăng xuất
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
