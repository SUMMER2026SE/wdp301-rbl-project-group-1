import { ACCEPTED_FILE_TYPES, MAX_FILE_SIZE } from "@/src/shared/constants/file";
import type { FileUploadProps } from "./type";
import { useFileUpload } from "@/src/shared/hooks/use-file-upload";
import { FileUploadPreview } from "./file-upload-preview";
import { FileUploadDropzone } from "./file-upload-dropzone";

export function FileUpload({
  value,
  onChange,
  accept = ACCEPTED_FILE_TYPES,
  maxSizeMB = MAX_FILE_SIZE / (1024 * 1024),
  className,
  placeholder = "Nhấn để tải lên hoặc kéo thả file vào đây",
  helperText = `Hỗ trợ tải lên file (Tối đa ${maxSizeMB}MB)`,
}: FileUploadProps) {
  const {
    dragActive,
    previewUrl,
    inputRef,
    handleDrag,
    handleDrop,
    handleChange,
    handleRemove,
  } = useFileUpload({ value, onChange, maxSizeMB });

  if (value) {
    return (
      <FileUploadPreview
        value={value}
        previewUrl={previewUrl}
        onRemove={handleRemove}
        className={className}
      />
    );
  }

  return (
    <FileUploadDropzone
      dragActive={dragActive}
      onDrag={handleDrag}
      onDrop={handleDrop}
      onChange={handleChange}
      inputRef={inputRef}
      accept={accept}
      placeholder={placeholder}
      helperText={helperText}
      className={className}
    />
  );
}
