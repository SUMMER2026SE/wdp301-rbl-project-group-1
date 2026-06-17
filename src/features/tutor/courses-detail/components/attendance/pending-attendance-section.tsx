"use client";

import { Button } from "@/src/shared/components/ui/button";
import { ClipboardCheck, Clock } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

interface PendingSession {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
}

interface PendingAttendanceProps {
  courseId: string;
  sessions: PendingSession[];
}

export function PendingAttendanceSection({
  courseId,
  sessions,
}: PendingAttendanceProps) {
  if (sessions.length === 0) {
    return null; // Don't show if there's nothing pending
  }

  return (
    <section className="flex flex-col gap-4 bg-white dark:bg-slate-800 p-6 rounded-xl border border-amber-200 dark:border-amber-900/50 shadow-sm relative overflow-hidden">
      {/* Background accent */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-amber-50 dark:bg-amber-900/10 rounded-bl-full -z-10" />

      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-amber-600 dark:text-amber-500 flex items-center gap-2">
          <Clock className="w-5 h-5" />
          Cần Điểm Danh
        </h2>
        <Button
          asChild
          variant="link"
          className="text-blue-600 hover:text-blue-700 text-sm font-semibold p-0 h-auto"
        >
          <Link href={`/tutor/courses/${courseId}/attendance`}>
            Đến trang điểm danh
          </Link>
        </Button>
      </div>

      <div className="flex flex-col gap-3">
        {sessions.map((session) => (
          <div
            key={session.id}
            className="flex items-center justify-between p-4 rounded-lg bg-amber-50/50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800/30"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400">
                <ClipboardCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="font-semibold text-slate-900 dark:text-white">
                  {session.title}
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {format(new Date(session.startTime), "EEEE, dd/MM/yyyy", {
                    locale: vi,
                  })}
                  {" • "}
                  {format(new Date(session.startTime), "HH:mm")} -{" "}
                  {format(new Date(session.endTime), "HH:mm")}
                </p>
              </div>
            </div>
            <Button asChild size="sm" variant="default" className="gap-2">
              <Link href={`/tutor/courses/${courseId}/attendance?expand=${session.id}`}>
                Điểm danh ngay
              </Link>
            </Button>
          </div>
        ))}
      </div>
    </section>
  );
}
