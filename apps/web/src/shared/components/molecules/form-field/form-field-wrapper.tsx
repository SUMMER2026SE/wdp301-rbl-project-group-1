"use client";

import { FormFieldWrapperProps } from "@/src/shared/components/molecules/form-field/type";
import { cn } from "@/src/shared/lib/utils";

export function FormFieldWrapper({
  label,
  error,
  children,
  className,
}: FormFieldWrapperProps) {
  return (
    <div className={cn("space-y-1", className)}>
      {label && <p className="text-sm font-bold text-foreground">{label}</p>}
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
