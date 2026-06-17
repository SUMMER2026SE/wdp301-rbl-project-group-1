/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  CheckCircle2,
  FileText,
  HelpCircle,
  Lock,
  Play,
  PlayCircle,
} from "lucide-react";
interface LessonItemProps {
  lesson: any;
  index: number;
}

const statusConfig = {
  completed: {
    bg: "bg-success-soft/30 dark:bg-success-soft/50",
    textColor: "text-success",
    bgColor: "bg-success-soft",
    label: "Hoàn thành",
    icon: <CheckCircle2 className="size-4" />,
  },
  "in-progress": {
    bg: "bg-primary/[0.04] dark:bg-primary/[0.08]",
    textColor: "text-primary",
    bgColor: "bg-primary/10",
    label: "Đang học",
    icon: <Play className="size-4 fill-current" />,
  },
  locked: {
    bg: "hover:bg-muted/50",
    textColor: "text-muted-foreground",
    bgColor: "bg-muted",
    label: "Chưa học",
    icon: <Lock className="size-4" />,
  },
  "not-started": {
    bg: "hover:bg-muted/50",
    textColor: "text-muted-foreground",
    bgColor: "bg-muted",
    label: "Chưa học",
    icon: <Play className="size-4" />,
  },
};

export function LessonItem({ lesson, index }: LessonItemProps) {
  const config = statusConfig[lesson.status as keyof typeof statusConfig];
  const isCompleted = lesson.status === "completed";

  return (
    <div
      className={`flex items-center justify-between p-4 ${config.bg} transition-colors border-b border-border last:border-0 cursor-pointer group`}
    >
      <div className="flex items-center gap-4">
        <div
          className={`size-8 rounded-full ${config.bgColor} ${config.textColor} flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110`}
        >
          {config.icon}
        </div>
        <div className="flex flex-col">
          <span
            className={`font-medium text-sm md:text-base ${
              isCompleted
                ? "line-through text-muted-foreground"
                : "text-foreground"
            } ${lesson.status === "in-progress" ? "text-primary font-bold" : ""}`}
          >
            Bài {index + 1}: {lesson.title}
          </span>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-muted-foreground/60">
              {lesson.type === "video" ? (
                <PlayCircle className="size-3.5" />
              ) : lesson.type === "pdf" ? (
                <FileText className="size-3.5" />
              ) : (
                <HelpCircle className="size-3.5" />
              )}
            </span>
            <span className="text-xs text-muted-foreground">
              {lesson.type === "video"
                ? `Video • ${lesson.duration}`
                : lesson.type === "pdf"
                  ? `Tài liệu • ${lesson.pageCount} Trang`
                  : `Kiểm tra • ${lesson.questionCount} Câu`}
            </span>
          </div>
        </div>
      </div>
      <span
        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md ${
          lesson.status === "completed"
            ? "text-success bg-success-soft"
            : lesson.status === "in-progress"
              ? "text-primary bg-primary/10"
              : "text-muted-foreground bg-muted"
        }`}
      >
        {config.label}
      </span>
    </div>
  );
}
