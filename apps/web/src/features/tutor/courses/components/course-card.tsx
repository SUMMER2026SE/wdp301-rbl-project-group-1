import { Button } from "@/src/shared/components/ui/button";
import { CalendarClock, MoreVertical, User, Users, Video } from "lucide-react";
import Link from "next/link";

interface CourseCardProps {
  id: string;
  subject: string;
  title: string;
  studentCount: string;
  schedule: string;
  meetLink: string;
  color: "blue" | "purple" | "green";
}

const colorConfig = {
  blue: {
    bar: "bg-blue-500",
    badge: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400",
  },
  purple: {
    bar: "bg-purple-500",
    badge:
      "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400",
  },
  green: {
    bar: "bg-green-500",
    badge:
      "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400",
  },
};

export function CourseCard({
  id,
  subject,
  title,
  studentCount,
  schedule,
  meetLink,
  color,
}: CourseCardProps) {
  const config = colorConfig[color];

  return (
    <Link href={`/tutor/courses/${id}`}>
      <div className="flex flex-col rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 overflow-hidden hover:shadow-lg transition-shadow cursor-pointer h-full">
        {/* Color bar */}
        <div className={`h-2 ${config.bar} w-full`}></div>

        {/* Content */}
        <div className="p-5 flex-1 flex flex-col gap-4">
          {/* Header with subject badge and menu */}
          <div className="flex justify-between items-start">
            <div>
              <span
                className={`inline-block px-2 py-1 ${config.badge} text-xs font-bold rounded mb-2`}
              >
                {subject}
              </span>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white line-clamp-2">
                {title}
              </h3>
            </div>
            <button className="flex items-center justify-center size-10 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 transition-colors">
              <MoreVertical className="size-5" />
            </button>
          </div>

          {/* Course details */}
          <div className="space-y-3 mt-2 flex-1">
            {/* Students */}
            <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400 text-sm">
              {studentCount.includes("1 ") ? (
                <User className="size-4 text-slate-400 shrink-0" />
              ) : (
                <Users className="size-4 text-slate-400 shrink-0" />
              )}
              <span>{studentCount}</span>
            </div>

            {/* Schedule */}
            <div className="flex items-start gap-3 text-slate-600 dark:text-slate-400 text-sm">
              <CalendarClock className="size-4 text-slate-400 shrink-0 mt-0.5" />
              <span>{schedule}</span>
            </div>

            {/* Meet link */}
            <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400 text-sm">
              <Video className="size-4 text-slate-400 shrink-0" />
              <span
                className="text-blue-600 dark:text-blue-400 hover:underline truncate cursor-pointer"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  window.open(meetLink, "_blank", "noopener,noreferrer");
                }}
              >
                {meetLink}
              </span>
            </div>
          </div>
        </div>

        {/* Footer button */}
        <div className="px-5 py-4 border-t border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
          <Button
            variant="outline"
            className="w-full py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-sm font-semibold text-slate-700 dark:text-slate-200 transition-colors"
          >
            Quản lý lớp
          </Button>
        </div>
      </div>
    </Link>
  );
}
