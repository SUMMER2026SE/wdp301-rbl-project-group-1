"use client";

import { Button } from "@/src/shared/components/ui/button";
import {
  Download,
  File,
  FileText,
  FolderOpen,
  Table2,
  Upload,
} from "lucide-react";
import type { ReactNode } from "react";

export interface ClassResource {
  id: string;
  name: string;
  uploadDate: string;
  fileSize: string;
  type: "pdf" | "doc" | "xlsx" | "other";
}

interface ClassResourcesSectionProps {
  resources: ClassResource[];
}

const getResourceIcon = (type: string): { icon: ReactNode; color: string } => {
  switch (type) {
    case "pdf":
      return {
        icon: <FileText className="size-5" />,
        color: "text-red-500 bg-red-50 dark:bg-red-900/20",
      };
    case "doc":
      return {
        icon: <FileText className="size-5" />,
        color: "text-blue-500 bg-blue-50 dark:bg-blue-900/20",
      };
    case "xlsx":
      return {
        icon: <Table2 className="size-5" />,
        color: "text-green-500 bg-green-50 dark:bg-green-900/20",
      };
    default:
      return {
        icon: <File className="size-5" />,
        color: "text-slate-500 bg-slate-50 dark:bg-slate-900/20",
      };
  }
};

export function ClassResourcesSection({
  resources,
}: ClassResourcesSectionProps) {
  return (
    <section className="flex flex-col gap-4 bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          Kho tài liệu lớp
        </h2>
        <Button
          variant="ghost"
          size="icon"
          className="text-slate-400 hover:text-blue-600"
        >
          <FolderOpen className="size-5" />
        </Button>
      </div>

      {/* Upload Button */}
      <Button
        variant="outline"
        className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg p-4 h-auto text-slate-500 dark:text-slate-400 hover:border-blue-600 hover:text-blue-600 bg-slate-50 dark:bg-slate-800/30"
      >
        <Upload className="size-5" />
        <span className="text-sm font-semibold">Tải lên tài liệu mới</span>
      </Button>

      {/* Resources List */}
      <div className="flex flex-col gap-3 mt-2">
        {resources.map((resource) => {
          const { icon, color } = getResourceIcon(resource.type);
          return (
            <div
              key={resource.id}
              className="flex items-center justify-between p-3 rounded-lg border border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50 group cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className={`${color} p-2 rounded`}>{icon}</div>
                <div>
                  <p className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1">
                    {resource.name}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Tải lên: {resource.uploadDate} • {resource.fileSize}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="text-slate-400 hover:text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Download className="size-5" />
              </Button>
            </div>
          );
        })}
      </div>

      {/* View More */}
      <Button
        variant="link"
        className="mt-2 text-blue-600 hover:text-blue-700 text-sm font-semibold p-0 h-auto"
      >
        Xem tất cả tài liệu
      </Button>
    </section>
  );
}
