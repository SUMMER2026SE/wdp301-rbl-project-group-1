import { cn } from "@/src/shared/lib/utils";
import { File, FileSpreadsheet, FileText, FileVideo } from "lucide-react";
import React from "react";

export interface FileItemInfoProps {
  /**
   * File extension/type to determine the icon and color.
   * e.g., 'pdf', 'doc', 'docx', 'xlsx', 'video', 'mp4'
   */
  type: string;
  /**
   * Title of the file
   */
  title: React.ReactNode;
  /**
   * Details like size, upload date, category, etc.
   */
  subtitle: React.ReactNode;
  /**
   * Optional wrapper class name
   */
  className?: string;
}

const getFileConfig = (type: string) => {
  const normalizedType = type.toLowerCase();
  switch (normalizedType) {
    case "pdf":
      return {
        icon: <FileText className="size-5" />,
        colorClass: "bg-error-soft text-error",
      };
    case "doc":
    case "docx":
      return {
        icon: <FileText className="size-5" />,
        colorClass: "bg-info-soft text-info",
      };
    case "xls":
    case "xlsx":
      return {
        icon: <FileSpreadsheet className="size-5" />,
        colorClass: "bg-success-soft text-success",
      };
    case "video":
    case "mp4":
      return {
        icon: <FileVideo className="size-5" />,
        colorClass: "bg-purple-soft text-purple",
      };
    default:
      return {
        icon: <File className="size-5" />,
        colorClass: "bg-muted text-muted-foreground",
      };
  }
};

export function FileItemInfo({
  type,
  title,
  subtitle,
  className,
}: FileItemInfoProps) {
  const { icon, colorClass } = getFileConfig(type);

  return (
    <div className={cn("flex items-center gap-3 overflow-hidden", className)}>
      <div
        className={cn(
          "flex-shrink-0 flex items-center justify-center size-10 rounded-lg",
          colorClass,
        )}
      >
        {icon}
      </div>
      <div className="flex flex-col min-w-0 flex-1">
        <span className="truncate font-semibold md:font-bold text-foreground transition-colors hover:text-primary text-sm md:text-base">
          {title}
        </span>
        <span className="truncate text-xs text-muted-foreground mt-0.5">
          {subtitle}
        </span>
      </div>
    </div>
  );
}
