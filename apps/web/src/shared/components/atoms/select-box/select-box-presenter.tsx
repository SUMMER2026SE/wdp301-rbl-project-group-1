import { Label } from "@/src/shared/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/shared/components/ui/select";
import { cn } from "@/src/shared/lib/utils";
import React from "react";
import type { SelectBoxPresenterProps } from "./type";

const SelectBoxPresenter: React.FC<SelectBoxPresenterProps> = ({
  label,
  name,
  value,
  placeholder,
  onChange,
  options,
  error,
  className,
  triggerClassName,
}) => {
  return (
    <div className={cn("grid w-full items-center gap-3", className)}>
      {label && <Label htmlFor={name}>{label}</Label>}
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger
          id={name}
          className={cn(
            "w-full h-12 bg-card text-foreground border-border shadow-sm focus:ring-2 focus:ring-primary focus:outline-none",
            triggerClassName,
          )}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value.toString()}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
};
export default SelectBoxPresenter;
