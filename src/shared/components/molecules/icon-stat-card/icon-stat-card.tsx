import { cn } from "@/src/shared/lib/utils";
import Link from "next/link";
import React from "react";

export interface IconStatCardProps {
  title: string;
  subtitle: React.ReactNode;
  icon: React.ReactNode;
  iconWrapperClassName?: string;
  className?: string;
  onClick?: () => void;
  href?: string;
}

export function IconStatCard({
  title,
  subtitle,
  icon,
  iconWrapperClassName,
  className,
  onClick,
  href,
}: IconStatCardProps) {
  const content = (
    <>
      <div
        className={cn(
          "flex items-center justify-center min-w-12 h-12 rounded-xl transition-transform group-hover:scale-110",
          iconWrapperClassName,
        )}
      >
        {icon}
      </div>
      <div>
        <h3 className="text-base md:text-lg font-bold text-foreground leading-tight">
          {title}
        </h3>
        <p className="text-xs md:text-sm text-muted-foreground mt-0.5">
          {subtitle}
        </p>
      </div>
    </>
  );

  const baseClassName = cn(
    "group flex items-center gap-4 p-4 md:p-5 rounded-xl border border-border bg-card hover:border-primary/50 cursor-pointer transition-all hover:shadow-md",
    className,
  );

  if (href) {
    return (
      <Link href={href} onClick={onClick} className={baseClassName}>
        {content}
      </Link>
    );
  }

  return (
    <div onClick={onClick} className={baseClassName}>
      {content}
    </div>
  );
}
