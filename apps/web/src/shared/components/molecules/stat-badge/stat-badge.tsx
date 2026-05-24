import { cn } from "@/src/shared/lib/utils";
import type { ReactNode } from "react";

export interface StatBadgeProps {
  icon: ReactNode;
  iconBgColor?: string;
  iconColor?: string;
  value: string | number;
  label: string;
  subtext?: string;
  className?: string; // Hỗ trợ custom style từ component cha
}

export function StatBadge({
  icon,
  iconBgColor = "bg-info/20",
  iconColor = "text-info",
  value,
  label,
  subtext,
  className,
}: StatBadgeProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div
        className={cn(
          "flex size-10 items-center justify-center rounded-full",
          iconBgColor,
          iconColor,
        )}
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
