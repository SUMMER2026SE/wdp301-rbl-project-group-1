import { Button } from "@/src/shared/components/ui/button";
import { Settings } from "lucide-react";

interface HeaderSectionProps {
  courseName: string;
  description: string;
}

export function HeaderSection({ courseName, description }: HeaderSectionProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 className="text-slate-900 dark:text-white text-3xl font-black leading-tight tracking-[-0.033em]">
          {courseName}
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-base mt-1">
          {description}
        </p>
      </div>
      <Button className="flex items-center gap-2 rounded-lg h-10 px-5 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-sm font-bold transition-colors">
        <Settings className="size-5" />
        <span>Cài đặt lớp</span>
      </Button>
    </div>
  );
}
