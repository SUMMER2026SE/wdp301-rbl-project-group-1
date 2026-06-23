"use client";

import { Button } from "@/src/shared/components/ui/button";
import { ArrowLeft, Video } from "lucide-react";
import Link from "next/link";

interface StartSessionButtonProps {
  meetLink?: string;
}

export function StartSessionButton({ meetLink }: StartSessionButtonProps) {
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
      <Button 
        className={`flex items-center justify-center gap-2 rounded-lg h-12 px-6 text-base font-bold transition-all w-full md:w-auto ${meetLink ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20' : 'bg-secondary text-secondary-foreground'}`}
        disabled={!meetLink}
        asChild
      >
        <a 
          href={meetLink || "#"} 
          target={meetLink ? "_blank" : "_self"} 
          rel="noopener noreferrer"
          onClick={(e) => !meetLink && e.preventDefault()}
        >
          <Video className={`size-5 ${meetLink ? 'animate-pulse' : ''}`} />
          <span>{meetLink ? "Vào phòng học trực tuyến (Meet)" : "Phòng học đang được khởi tạo..."}</span>
        </a>
      </Button>
    </div>
  );
}
