import { Button } from "@/src/shared/components/ui/button";
import { CalendarDays, Users } from "lucide-react";
import type { ReactNode } from "react";

interface AssignmentCardProps {
  icon: ReactNode;
  iconBgColor: string;
  title: string;
  dueDate: string;
  dueTime: string;
  submitted: number;
  total: number;
  actionButtonText: string;
  isCompleted?: boolean;
}

export function AssignmentCard({
  icon,
  iconBgColor,
  title,
  dueDate,
  dueTime,
  submitted,
  total,
  actionButtonText,
  isCompleted = false,
}: AssignmentCardProps) {
  return (
    <div
      className={`flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 gap-4 ${isCompleted ? "opacity-75" : ""}`}
    >
      <div className="flex gap-4 items-start w-full sm:w-auto">
        <div
          className={`flex items-center justify-center size-10 rounded-full flex-shrink-0 mt-1 ${iconBgColor}`}
        >
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <h3
            className={`text-base font-bold text-slate-900 dark:text-white ${isCompleted ? "line-through text-slate-500" : ""}`}
          >
            {title}
          </h3>
          <div className="flex items-center gap-3 mt-1 text-sm text-slate-500 dark:text-slate-400 flex-wrap">
            <span className="flex items-center gap-1">
              <CalendarDays className="size-4" />
              Hạn nộp: {dueDate} {dueTime}
            </span>
            <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600"></span>
            <span className="flex items-center gap-1 font-medium text-slate-700 dark:text-slate-300">
              <Users className="size-4 text-slate-400" />
              Đã nộp: {submitted}/{total}
            </span>
          </div>
        </div>
      </div>
      <Button
        className={`w-full sm:w-auto px-5 py-2 rounded-lg text-sm font-bold transition-colors whitespace-nowrap ${
          isCompleted
            ? "border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200"
            : "bg-blue-600 hover:bg-blue-700 text-white"
        }`}
      >
        {actionButtonText}
      </Button>
    </div>
  );
}
