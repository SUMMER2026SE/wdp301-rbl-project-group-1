"use client";

import { useGetAllGradesQuery } from "@/src/features/academic-catalog/academicCatalogApi";
import CheckboxField from "@/src/shared/components/atoms/checkbox-field/checkbox-field";

interface GradeCheckboxProps {
  selectedIds: string[];
  onChange: (nextIds: string[]) => void;
  error?: string;
  className?: string;
}

export function GradeCheckbox({
  selectedIds,
  onChange,
  error,
  className = "",
}: GradeCheckboxProps) {
  const { data: gradesData, isLoading } = useGetAllGradesQuery();
  const gradeOptions =
    gradesData?.data
      .slice()
      .sort((a, b) => a.order - b.order)
      .map((g) => ({ value: g.id, label: g.name })) ?? [];

  if (isLoading) {
    return <p className="text-sm text-muted-foreground">Đang tải...</p>;
  }

  return (
    <div
      className={`grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-3 ${className}`}
    >
      {gradeOptions.map((opt) => (
        <CheckboxField
          key={opt.value}
          id={`grade-${opt.value}`}
          name={`grade-${opt.value}`}
          label={opt.label}
          defaultValue={selectedIds.includes(opt.value)}
          onChange={() => {
            const isChecked = selectedIds.includes(opt.value);
            const next = isChecked
              ? selectedIds.filter((id) => id !== opt.value)
              : [...selectedIds, opt.value];
            onChange(next);
          }}
        />
      ))}
      {error && <p className="text-xs text-destructive col-span-full mt-1">{error}</p>}
    </div>
  );
}
