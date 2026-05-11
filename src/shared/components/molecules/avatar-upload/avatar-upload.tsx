import Image from "next/image";
import { Camera } from "lucide-react";
import { Input } from "@/src/shared/components/ui/input";
import { cn } from "@/src/shared/lib/utils";
import { useFileUpload } from "@/src/shared/hooks/use-file-upload";
import { IMAGE_FILE_TYPES, MAX_FILE_SIZE } from "@/src/shared/constants/file";
import type { AvatarUploadProps } from "./type";

export function AvatarUpload({
  value,
  onChange,
  className,
  accept = IMAGE_FILE_TYPES,
  maxSizeMB = MAX_FILE_SIZE / (1024 * 1024),
}: AvatarUploadProps) {
  const {
    dragActive,
    previewUrl,
    inputRef,
    handleDrag,
    handleDrop,
    handleChange,
  } = useFileUpload({ value, onChange, maxSizeMB });

  return (
    <div
      className={cn(
        "relative w-32 h-32 rounded-full border-2 border-dashed flex flex-col items-center justify-center text-muted-foreground shrink-0 cursor-pointer transition-colors overflow-hidden group",
        dragActive ? "border-primary bg-primary/5" : "border-input bg-muted hover:bg-muted/80",
        className
      )}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
    >
      <Input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleChange}
        className="hidden"
      />
      {previewUrl ? (
        <>
          <Image
            src={previewUrl}
            alt="Avatar"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <Camera className="w-8 h-8 text-white" />
          </div>
        </>
      ) : (
        <>
          <Camera className="w-10 h-10 mb-1" />
          <span className="text-xs font-medium">Tải ảnh lên</span>
        </>
      )}
    </div>
  );
}
