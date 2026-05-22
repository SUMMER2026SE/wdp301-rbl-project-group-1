"use client";

import { Input } from "@/src/shared/components/ui/input";
import { cn } from "@/src/shared/lib/utils";
import { Search } from "lucide-react";
import { forwardRef } from "react";

export interface SearchBoxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
}

export const SearchBox = forwardRef<HTMLInputElement, SearchBoxProps>(
  (
    {
      className,
      icon = <Search className="size-4 text-muted-foreground" />,
      placeholder = "Tìm kiếm...",
      ...props
    },
    ref,
  ) => {
    return (
      <div className={cn("relative w-full", className)}>
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
          {icon}
        </div>
        <Input
          ref={ref}
          type="search"
          placeholder={placeholder}
          className="pl-9 bg-card"
          {...props}
        />
      </div>
    );
  },
);

SearchBox.displayName = "SearchBox";

export default SearchBox;
