"use client";

import { cn } from "@/lib/utils";
import MainNavigationMenu from "@/src/shared/components/molecules/main-navigation-menu/main-navigation-menu";
import MenuButton from "@/src/shared/components/molecules/menu-button/menu-button";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/src/shared/components/ui/avatar";
import { NavigationBarProps } from "./type";

export default function NavigationBar({
  menu,
  brand,
  onBrandClick,
  onAvatarClick,
  children,
}: NavigationBarProps) {
  return (
    <div className="flex items-center justify-between relative w-full gap-4">
      <div className="md:hidden absolute top-0 right-0">
        <MenuButton menu={menu}>{children}</MenuButton>
      </div>
      <div className="flex items-center min-w-0 shrink-0">
        {brand ? (
          onBrandClick ? (
            <button
              type="button"
              className="cursor-pointer"
              onClick={onBrandClick}
            >
              {brand}
            </button>
          ) : (
            <div>{brand}</div>
          )
        ) : (
          <Avatar
            className={cn("w-17.25 h-17.25", onAvatarClick && "cursor-pointer")}
            onClick={onAvatarClick}
          >
            <AvatarImage
              src="https://github.com/shadcn.png"
              className="object-contain"
            />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        )}
      </div>

      <div className="hidden md:flex items-center gap-4 ml-auto">
        <MainNavigationMenu menu={menu} />
        {children}
      </div>
    </div>
  );
}
