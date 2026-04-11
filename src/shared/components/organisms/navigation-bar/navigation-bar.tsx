"use client";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import MenuButton from "@/src/shared/components/molecules/menu-button/menu-button";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/src/shared/components/ui/avatar";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/src/shared/components/ui/navigation-menu";

import { NavigationBarItemProps, NavigationBarProps } from "./type";

const triggerStyle = () =>
  "transition-colors ease-in-out duration-200 bg-transparent hover:bg-blue-100 hover:text-blue-700 data-open:hover:bg-blue-100 data-open:hover:text-blue-700 data-open:bg-blue-100 data-open:text-blue-700 focus:bg-blue-100 focus:text-blue-700 text-center";
const contentStyle = () =>
  "bg-white hover:bg-blue-50 data-[state=open]:hover:bg-blue-50 data-[state=open]:bg-blue-50 focus:bg-blue-50";

const activeStyle =
  "!bg-primary !text-primary-foreground hover:!bg-primary hover:!text-primary-foreground focus:!bg-primary focus:!text-primary-foreground data-open:!bg-primary data-open:!text-primary-foreground data-open:hover:!bg-primary data-open:hover:!text-primary-foreground data-popup-open:!bg-primary data-popup-open:!text-primary-foreground data-popup-open:hover:!bg-primary data-popup-open:hover:!text-primary-foreground data-active:!bg-primary data-active:!text-primary-foreground data-active:hover:!bg-primary data-active:hover:!text-primary-foreground data-active:focus:!bg-primary data-active:focus:!text-primary-foreground";

export default function NavigationBar({
  menu,
  brand,
  onBrandClick,
  onAvatarClick,
  children,
}: NavigationBarProps) {
  const pathname = usePathname();

  const isItemActive = (
    href?: string,
    activePrefix?: string,
    content?: NavigationBarItemProps["content"],
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
        <NavigationMenu viewport={false} className="hidden md:block">
          <NavigationMenuList className="group gap-2 bg-transparent border-0">
            {menu &&
              menu.map(({ key, trigger, href, activePrefix, content }) => {
                const active = isItemActive(href, activePrefix, content);

                return (
                  <NavigationMenuItem key={key}>
                    {content && content.length > 0 ? (
                      <NavigationMenuTrigger
                        className={cn(
                          "bg-transparent cursor-pointer rounded-md text-sm font-semibold [&>svg]:hidden",
                          active ? activeStyle : triggerStyle(),
                        )}
                      >
                        {trigger}
                      </NavigationMenuTrigger>
                    ) : (
                      <NavigationMenuLink
                        active={active}
                        className={cn(
                          "bg-transparent cursor-pointer rounded-md text-sm font-semibold flex items-center justify-center",
                          active ? activeStyle : triggerStyle(),
                        )}
                        href={href}
                      >
                        {trigger}
                      </NavigationMenuLink>
                    )}
                    {content && content.length > 0 && (
                      <NavigationMenuContent>
                        {content.map(({ href, element }) => (
                          <NavigationMenuLink
                            key={key + href}
                            asChild
                            className={cn(
                              "hover:bg-foreground/48 text-2xl font-semibold text-center data-[active=true]:focus:bg-foreground/48 data-[active=true]:bg-foreground/48 focus:bg-foreground/48",
                              contentStyle(),
                            )}
                            href={href}
                          >
                            {element}
                          </NavigationMenuLink>
                        ))}
                      </NavigationMenuContent>
                    )}
                  </NavigationMenuItem>
                );
              })}
          </NavigationMenuList>
        </NavigationMenu>
        {children}
      </div>
    </div>
  );
}
