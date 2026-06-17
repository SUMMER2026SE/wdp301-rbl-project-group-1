"use client";

interface HeaderSectionProps {
  courseName: string;
  description?: string;
}

export function HeaderSection({ courseName, description }: HeaderSectionProps) {
  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
        {courseName}
      </h1>
      {description && (
        <p className="text-base text-slate-500 dark:text-slate-400">
          {description}
        </p>
      )}
    </div>
  );
}
