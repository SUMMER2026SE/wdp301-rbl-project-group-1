"use client";

import MainNavigationMenu from "@/src/shared/components/molecules/main-navigation-menu/main-navigation-menu";
import type { MainNavigationMenuItem } from "@/src/shared/components/molecules/main-navigation-menu/type";

import { type ProfileTabId } from "../constants";

interface ProfileNavigationProps {
  tabs: ReadonlyArray<{
    id: ProfileTabId;
    label: string;
    href: string;
    activePrefix?: string;
  }>;
}

export function ProfileNavigation({ tabs }: ProfileNavigationProps) {
  const menu: MainNavigationMenuItem[] = tabs.map((tab) => ({
    key: tab.id,
    trigger: tab.label,
    href: tab.href,
    activePrefix: tab.activePrefix,
  }));

  return (
    <div className="border-b border-border">
      <MainNavigationMenu
        menu={menu}
        className="block max-w-full"
        listClassName="h-auto w-full gap-0 overflow-x-auto rounded-none border-0 bg-transparent px-0"
        itemClassName="flex-1"
        activeClassName="!bg-blue-100 !text-blue-700 hover:!bg-blue-100 hover:!text-blue-700 focus:!bg-blue-100 focus:!text-blue-700"
      />
    </div>
  );
}
