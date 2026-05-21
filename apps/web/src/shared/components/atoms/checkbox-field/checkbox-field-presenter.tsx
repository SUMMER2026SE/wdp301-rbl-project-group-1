import { Checkbox } from "@/src/shared/components/ui/checkbox";
import { Label } from "@/src/shared/components/ui/label";
import { cn } from "@/src/shared/lib/utils";
import React from "react";
import type { CheckboxFieldPresenterProps } from "./type";

const CheckboxFieldPresenter: React.FC<CheckboxFieldPresenterProps> = ({
  id,
  name,
  value,
  onChange,
  error,
  className,
  label,
  children,
}) => {
  const checkboxId = id || name;
  return (
    <div>
      <div
        className={cn(
          "flex flex-row items-start space-x-3 space-y-0",
          className,
        )}
      >
        <Checkbox
          id={checkboxId}
          checked={!!value}
          onCheckedChange={(checked) => onChange(checked === true)}
          className="mt-0.5 rounded border-input bg-background"
        />
        {(label || children) && (
          <Label
            htmlFor={checkboxId}
            className="font-normal text-sm text-foreground cursor-pointer leading-snug"
          >
            {label}
            {children}
          </Label>
        )}
      </div>
      {error && <p className="text-sm text-destructive mt-2">{error}</p>}
    </div>
  );
};
export default CheckboxFieldPresenter;
