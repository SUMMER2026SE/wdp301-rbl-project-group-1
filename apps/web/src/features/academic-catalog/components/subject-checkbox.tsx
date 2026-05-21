"use client";

import { useGetAllSubjectsQuery } from "@/src/features/academic-catalog/academicCatalogApi";
import CheckboxField from "@/src/shared/components/atoms/checkbox-field/checkbox-field";

interface SubjectCheckboxProps {
  selectedIds: string[];
  onChange: (nextIds: string[]) => void;
  error?: string;
  className?: string;
}

export function SubjectCheckbox({
  selectedIds,
  onChange,
  error,
  className = "",
}: SubjectCheckboxProps) {
  const { data: subjectsData, isLoading } = useGetAllSubjectsQuery();
  const subjectOptions =
    subjectsData?.data.map((s) => ({ value: s.id, label: s.name })) ?? [];

  if (isLoading) {
    return <p className="text-sm text-muted-foreground">Đang tải...</p>;
  }

  return (
    <div
      className={`grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-3 ${className}`}
    >
      {subjectOptions.map((opt) => (
        <CheckboxField
          key={opt.value}
          id={`subject-${opt.value}`}
          name={`subject-${opt.value}`}
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
