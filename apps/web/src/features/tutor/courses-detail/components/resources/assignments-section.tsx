import { Button } from "@/src/shared/components/ui/button";
import { Plus } from "lucide-react";
import type { ReactNode } from "react";
import { AssignmentCard } from "./assignment-card";

interface AssignmentsSectionProps {
  assignments: Array<{
    id: string;
    icon: ReactNode;
    iconBgColor: string;
    title: string;
    dueDate: string;
    dueTime: string;
    submitted: number;
    total: number;
    actionButtonText: string;
    isCompleted?: boolean;
  }>;
}

export function AssignmentsSection({ assignments }: AssignmentsSectionProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          Bài tập đã giao
        </h2>
        <Button className="flex items-center gap-2 rounded-lg h-9 px-4 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 text-sm font-bold transition-colors">
          <Plus className="size-4" />
          <span>Giao bài tập</span>
        </Button>
      </div>

      {/* Assignments list */}
      <div className="flex flex-col gap-4">
        {assignments.map((assignment) => (
          <AssignmentCard
            key={assignment.id}
            icon={assignment.icon}
            iconBgColor={assignment.iconBgColor}
            title={assignment.title}
            dueDate={assignment.dueDate}
            dueTime={assignment.dueTime}
            submitted={assignment.submitted}
            total={assignment.total}
            actionButtonText={assignment.actionButtonText}
            isCompleted={assignment.isCompleted}
          />
        ))}
      </div>
    </div>
  );
}
