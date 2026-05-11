import { DragEvent, ChangeEvent, RefObject } from "react";
import { Input } from "@/src/shared/components/ui/input";
import { Button } from "@/src/shared/components/ui/button";
import { UploadCloud } from "lucide-react";
import { cn } from "@/src/shared/lib/utils";

interface FileUploadDropzoneProps {
  dragActive: boolean;
  onDrag: (e: DragEvent<HTMLDivElement>) => void;
  onDrop: (e: DragEvent<HTMLDivElement>) => void;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  inputRef: RefObject<HTMLInputElement | null>;
  accept?: string;
  placeholder?: string;
  helperText?: string;
  className?: string;
}

export function FileUploadDropzone({
  dragActive,
  onDrag,
  onDrop,
  onChange,
  inputRef,
  accept,
  placeholder,
  helperText,
  className,
}: FileUploadDropzoneProps) {
  return (
    <div
      className={cn(
        "w-full rounded-xl border-2 border-dashed border-input bg-muted/50 p-8 flex flex-col items-center justify-center text-center hover:bg-muted transition-colors cursor-pointer",
        dragActive ? "border-primary bg-primary/5" : "",
        className,
      )}
      onDragEnter={onDrag}
      onDragLeave={onDrag}
      onDragOver={onDrag}
      onDrop={onDrop}
      onClick={() => inputRef.current?.click()}
    >
      <Input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={onChange}
        className="hidden"
      />
      <div className="w-12 h-12 rounded-full bg-primary/20 text-primary flex items-center justify-center mb-4 pointer-events-none">
        <UploadCloud className="w-6 h-6" />
      </div>
      <p className="text-sm font-bold text-foreground mb-1 pointer-events-none">
        {placeholder}
      </p>
      <p className="text-xs text-muted-foreground mb-4 pointer-events-none">
        {helperText}
      </p>
      <Button
        type="button"
        variant="outline"
        onClick={(e) => {
          e.stopPropagation();
          inputRef.current?.click();
        }}
        className="h-9 px-4 rounded-lg bg-background border border-input text-sm font-medium text-foreground hover:bg-muted transition-colors"
      >
        Chọn file
      </Button>
    </div>
  );
}
