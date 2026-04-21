import React from "react";

import { Input } from "@/src/shared/components/ui/input";
import { Label } from "@/src/shared/components/ui/label";
import { cn } from "@/src/shared/lib/utils";

import type { TextBoxPresenterProps } from "./type";

const TextBoxPresenter: React.FC<TextBoxPresenterProps> = ({
  label,
  name,
  type = "text",
  value,
  placeholder,
  onChange,
  onBlur,
  reference,
  icon,
  className,
  inputClassName,
  error,
}) => {
  const errorId = error ? `${name}-error` : undefined;

  return (
    <div className={cn("grid w-full items-center gap-3", className)}>
      {label && (
        <Label htmlFor={name} className="font-bold">
          {label}
        </Label>
      )}
      <div className="relative">
        {icon && (
          <>
            {typeof icon === "string" ? (
              <span className="material-symbols-outlined pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xl text-muted-foreground">
                {icon}
              </span>
            ) : (
              <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5 flex items-center justify-center">
                {icon}
              </div>
            )}
          </>
        )}
        <Input
          id={name}
          name={name}
          type={type}
          value={value}
          placeholder={placeholder}
          onChange={onChange}
          onBlur={onBlur}
          ref={reference}
          aria-invalid={Boolean(error)}
          aria-describedby={errorId}
          className={cn(
            "border border-border bg-card text-foreground shadow-sm focus:border-primary focus:ring-2 focus:ring-primary focus:outline-none",
            error &&
              "border-destructive focus:border-destructive focus:ring-destructive/20",
            icon && "h-12 pl-10",
            inputClassName,
          )}
        />
      </div>
      {error && (
        <p id={errorId} className="text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  );
};
export default TextBoxPresenter;
