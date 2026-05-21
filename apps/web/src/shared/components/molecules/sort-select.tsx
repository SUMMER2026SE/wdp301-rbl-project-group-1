"use client";

interface SortSelectProps {
  value: string;
  onChange: (value: string) => void;
  options?: Array<{ value: string; label: string }>;
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
}: SortSelectProps) {
  return (
    <div className="flex items-center gap-2">
      <label className="text-sm text-muted-foreground">Sắp xếp:</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="px-3 py-1.5 border border-border rounded-md bg-card text-sm text-foreground"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
