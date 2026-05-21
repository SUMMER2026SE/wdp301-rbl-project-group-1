"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/src/shared/components/ui/navigation-menu";

import type { MainNavigationMenuItem, MainNavigationMenuProps } from "./type";

const triggerStyle = () =>
  "transition-colors ease-in-out duration-200 bg-transparent hover:bg-blue-100 hover:text-blue-700 data-open:hover:bg-blue-100 data-open:hover:text-blue-700 data-open:bg-blue-100 data-open:text-blue-700 focus:bg-blue-100 focus:text-blue-700 text-center";
const contentStyle = () =>
  "bg-white hover:bg-blue-50 data-[state=open]:hover:bg-blue-50 data-[state=open]:bg-blue-50 focus:bg-blue-50";

const activeStyle =
  "!bg-primary !text-primary-foreground hover:!bg-primary hover:!text-primary-foreground focus:!bg-primary focus:!text-primary-foreground data-open:!bg-primary data-open:!text-primary-foreground data-open:hover:!bg-primary data-open:hover:!text-primary-foreground data-popup-open:!bg-primary data-popup-open:!text-primary-foreground data-popup-open:hover:!bg-primary data-popup-open:hover:!text-primary-foreground data-active:!bg-primary data-active:!text-primary-foreground data-active:hover:!bg-primary data-active:hover:!text-primary-foreground data-active:focus:!bg-primary data-active:focus:!text-primary-foreground";

const isItemActive = (
  pathname: string,
  href?: string,
  activePrefix?: string,
  content?: MainNavigationMenuItem["content"],
) => {
  const checkPath = activePrefix || href;

  if (checkPath && pathname.startsWith(checkPath)) {
    return true;
  }

  if (content) {
    return content.some((c) => pathname.startsWith(c.href));
  }

  return false;
};

export default function DesktopNavigationMenu({
  menu,
  className,
  listClassName,
  activeClassName,
  itemClassName,
}: MainNavigationMenuProps) {
  const pathname = usePathname();

  return (
    <NavigationMenu
      viewport={false}
      className={cn("hidden md:block", className)}
    >
      <NavigationMenuList
        className={cn("group gap-2 bg-transparent border-0", listClassName)}
      >
        {menu.map(({ key, trigger, href, activePrefix, content }) => {
          const active = isItemActive(pathname, href, activePrefix, content);

          return (
            <NavigationMenuItem key={key} className={itemClassName}>
              {content && content.length > 0 ? (
                <NavigationMenuTrigger
                  className={cn(
                    "bg-transparent cursor-pointer rounded-md text-sm font-semibold [&>svg]:hidden",
                    active ? activeClassName || activeStyle : triggerStyle(),
                  )}
                >
                  {trigger}
                </NavigationMenuTrigger>
              ) : (
                <NavigationMenuLink
                  asChild
                  active={active}
                  className={cn(
                    "bg-transparent cursor-pointer rounded-md text-sm font-semibold flex items-center justify-center",
                    active ? activeClassName || activeStyle : triggerStyle(),
                  )}
                >
                  <Link href={href || "#"}>{trigger}</Link>
                </NavigationMenuLink>
              )}
              {content && content.length > 0 && (
                <NavigationMenuContent>
                  {content.map(({ href: contentHref, element }) => (
                    <NavigationMenuLink
                      key={key + contentHref}
                      asChild
                      className={cn(
                        "hover:bg-foreground/48 text-2xl font-semibold text-center data-[active=true]:focus:bg-foreground/48 data-[active=true]:bg-foreground/48 focus:bg-foreground/48",
                        contentStyle(),
                      )}
                    >
                      <Link href={contentHref}>{element}</Link>
                    </NavigationMenuLink>
                  ))}
                </NavigationMenuContent>
              )}
            </NavigationMenuItem>
          );
        })}
      </NavigationMenuList>
    </NavigationMenu>
  );
}
