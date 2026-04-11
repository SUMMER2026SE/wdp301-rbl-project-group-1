"use client";

import { Search } from "lucide-react";
import { Input } from "@/src/shared/components/ui/input";
import { cn } from "@/lib/utils";

interface SearchBoxProps {
  placeholder?: string;
  className?: string;
  value?: string;
  onChange?: (value: string) => void;
}

export default function SearchBox({
  placeholder = "Tìm kiếm...",
  className,
  value,
  onChange,
}: SearchBoxProps) {
  return (
    <div className={cn("relative w-full", className)}>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />

      <Input
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        className="pl-9"
      />
    </div>
  );
}
