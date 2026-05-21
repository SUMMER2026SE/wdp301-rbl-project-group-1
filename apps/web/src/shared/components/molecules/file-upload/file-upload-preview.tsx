import Image from "next/image";
import { Button } from "@/src/shared/components/ui/button";
import { FileText, Image as ImageIcon, X } from "lucide-react";
import { cn } from "@/src/shared/lib/utils";
import { formatFileSize } from "@/src/shared/utils/file";
import React from "react";

interface FileUploadPreviewProps {
  value: File;
  previewUrl: string | null;
  onRemove: (e: React.MouseEvent) => void;
  className?: string;
}

export function FileUploadPreview({
  value,
  previewUrl,
  onRemove,
  className,
}: FileUploadPreviewProps) {
  const isImage = value.type.startsWith("image/");

  return (
    <div
      className={cn(
        "relative w-full rounded-xl border border-border bg-muted/50 p-4 flex items-center justify-between",
        className,
      )}
    >
      <div className="flex items-center gap-4">
        {isImage ? (
          <div className="w-12 h-12 rounded-lg bg-muted overflow-hidden shrink-0 flex items-center justify-center">
            {previewUrl ? (
              <Image
                src={previewUrl}
                alt={value.name}
                width={48}
                height={48}
                className="w-full h-full object-cover"
              />
            ) : (
              <ImageIcon className="w-6 h-6 text-muted-foreground" />
            )}
          </div>
        ) : (
          <div className="w-12 h-12 rounded-lg bg-destructive/10 text-destructive flex items-center justify-center shrink-0">
            <FileText className="w-6 h-6" />
          </div>
        )}
        <div>
          <p className="text-sm font-bold text-foreground truncate max-w-[200px] sm:max-w-xs">
            {value.name}
          </p>
          <p className="text-xs text-muted-foreground">
            {formatFileSize(value.size)}
          </p>
        </div>
      </div>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={onRemove}
        className="w-8 h-8 rounded-full bg-background border border-input flex items-center justify-center text-muted-foreground hover:text-destructive hover:border-destructive/20 hover:bg-destructive/10 transition-colors shrink-0"
      >
        <X className="w-4 h-4" />
      </Button>
    </div>
  );
}
