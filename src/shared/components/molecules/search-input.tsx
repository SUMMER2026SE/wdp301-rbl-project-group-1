"use client";

import { Search } from "lucide-react";
import { forwardRef } from "react";

interface SearchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
}

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  (
    { icon = <Search className="size-4 text-muted-foreground" />, ...props },
    ref,
  ) => {
    return (
      <div className="relative flex items-center">
        <div className="absolute left-3 top-1/2 -translate-y-1/2">{icon}</div>
        <input
          ref={ref}
          type="text"
          {...props}
          className="w-full pl-9 pr-4 py-2.5 border border-border rounded-lg bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>
    );
  },
);

SearchInput.displayName = "SearchInput";
