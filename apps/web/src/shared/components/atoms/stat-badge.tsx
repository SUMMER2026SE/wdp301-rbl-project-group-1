"use client";

import type { ReactNode } from "react";

interface StatBadgeProps {
  icon: ReactNode;
  iconBgColor?: string;
  iconColor?: string;
  value: string | number;
  label: string;
  subtext?: string;
}

export function StatBadge({
  icon,
  iconBgColor = "bg-info/20",
  iconColor = "text-info",
  value,
  label,
  subtext,
}: StatBadgeProps) {
  return (
    <div className="flex items-center gap-2">
      <div
        className={`size-10 rounded-full ${iconBgColor} flex items-center justify-center ${iconColor}`}
      >
        {icon}
      </div>
      <div>
        <div className="flex items-center gap-1 font-bold text-foreground">
          <span>{value}</span>
          {subtext && (
            <span className="text-sm font-normal text-muted-foreground">
              {subtext}
            </span>
          )}
        </div>
        <p className="text-xs text-muted-foreground">{label}</p>
      </div>
    </div>
  );
}
