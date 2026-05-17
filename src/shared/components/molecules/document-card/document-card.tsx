import { Button } from "@/src/shared/components/ui/button";
import { FileText, Folder, MoreVertical, PlayCircle } from "lucide-react";

export type DocumentIconType = "picture_as_pdf" | "play_circle" | "folder";

export interface DocumentCardProps {
  icon: DocumentIconType;
  iconColor: "red" | "blue" | "yellow";
  fileName: string;
  fileSize: string;
  uploadTime: string;
}

const iconColorConfig: Record<DocumentCardProps["iconColor"], string> = {
  red: "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400",
  blue: "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400",
  yellow:
    "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400",
};

const iconMap: Record<DocumentIconType, React.ReactNode> = {
  picture_as_pdf: <FileText className="size-6" />,
  play_circle: <PlayCircle className="size-6" />,
  folder: <Folder className="size-6" />,
};

export function DocumentCard({
  icon,
  iconColor,
  fileName,
  fileSize,
  uploadTime,
}: DocumentCardProps) {
  return (
    <div className="flex items-center gap-4 p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:shadow-sm transition-shadow">
      <div
        className={`flex items-center justify-center size-12 rounded-lg flex-shrink-0 ${iconColorConfig[iconColor]}`}
      >
        {iconMap[icon]}
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white truncate">
          {fileName}
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          {fileSize} • Tải lên {uploadTime}
        </p>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 flex-shrink-0"
      >
        <MoreVertical className="size-5" />
      </Button>
    </div>
  );
}
