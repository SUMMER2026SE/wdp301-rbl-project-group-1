"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/shared/components/ui/select";
import { cn } from "@/src/shared/lib/utils";

interface SortSelectProps {
  value: string;
  onChange: (value: string) => void;
  options?: Array<{ value: string; label: string }>;
  className?: string; // Hỗ trợ custom css từ bên ngoài
  label?: string;
  placeholder?: string;
}

const DEFAULT_OPTIONS = [
  { value: "rating", label: "Đánh giá cao nhất" },
  { value: "price-low", label: "Giá thấp nhất" },
  { value: "price-high", label: "Giá cao nhất" },
  { value: "experience", label: "Kinh nghiệm" },
];

export function SortSelect({
  value,
  onChange,
  options = DEFAULT_OPTIONS,
  className,
  label = "Sắp xếp:",
  placeholder = "Chọn kiểu sắp xếp",
}: SortSelectProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      {label && (
        <label className="text-sm text-muted-foreground whitespace-nowrap">
          {label}
        </label>
      )}
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-[180px] bg-card">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
