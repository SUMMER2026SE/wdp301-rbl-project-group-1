import { cn } from "@/src/shared/lib/utils";
import type { ReactNode } from "react";

interface PaymentMethodItemProps {
  selected: boolean;
  onClick: () => void;
  icon: string;
  iconBgClassName?: string;
  iconColorClassName?: string;
  title: string;
  subtitle: string;
  children?: ReactNode;
}

export const PaymentMethodItem = ({
  selected,
  onClick,
  icon,
  iconBgClassName = "bg-primary/10",
  iconColorClassName = "text-primary",
  title,
  subtitle,
  children,
}: PaymentMethodItemProps) => {
  return (
    <div
      className={cn(
        "cursor-pointer p-4 border rounded-xl transition-all duration-200",
        selected
          ? "border-primary ring-1 ring-primary/20"
          : "border-border hover:border-primary/50",
      )}
      onClick={onClick}
    >
      <div
        className={cn(
          "flex items-center justify-between",
          selected && children ? "mb-4" : "",
        )}
      >
        <div className="flex items-center gap-4">
          <div
            className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center",
              iconBgClassName,
              iconColorClassName,
            )}
          >
            <span className="material-symbols-outlined">{icon}</span>
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">{title}</p>
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          </div>
        </div>
        <div
          className={cn(
            "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors",
            selected ? "border-primary" : "border-border",
          )}
        >
          {selected && <div className="w-3 h-3 bg-primary rounded-full" />}
        </div>
      </div>
      {selected && children}
    </div>
  );
};
