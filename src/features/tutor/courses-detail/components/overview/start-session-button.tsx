"use client";

import { Button } from "@/src/shared/components/ui/button";
import { ArrowLeft, Video } from "lucide-react";
import Link from "next/link";

export function StartSessionButton() {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pt-4 border-b border-slate-200 dark:border-slate-800 pb-6">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Link
            className="text-slate-500 hover:text-blue-600 transition-colors flex items-center gap-1"
            href="/tutor/courses"
          >
            <ArrowLeft className="size-4" /> Danh sách lớp
          </Link>
        </div>
      </div>
      <Button className="flex items-center justify-center gap-2 rounded-lg h-12 px-6 bg-blue-600 hover:bg-blue-700 text-white text-base font-bold transition-all shadow-md shadow-blue-500/20 w-full md:w-auto">
        <Video className="size-5 animate-pulse" />
        <span>Bắt đầu buổi học (Google Meet)</span>
      </Button>
    </div>
  );
}
