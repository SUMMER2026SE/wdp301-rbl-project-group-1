import { validateFileSize } from "@/src/shared/utils/file";
import { ChangeEvent, DragEvent, useEffect, useRef, useState } from "react";

export interface UseFileUploadProps {
  value?: File | null;
  onChange?: (file: File | null) => void;
  maxSizeMB?: number;
}

export function useFileUpload({
  value,
  onChange,
  maxSizeMB = 5,
}: UseFileUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    let urlToRevoke: string | null = null;

    const applyPreview = () => {
      if (value && value.type?.startsWith("image/")) {
        urlToRevoke = URL.createObjectURL(value);
        setPreviewUrl(urlToRevoke);
      } else {
        setPreviewUrl(null);
      }
    };

    applyPreview();

    return () => {
      if (urlToRevoke) {
        URL.revokeObjectURL(urlToRevoke);
      }
    };
  }, [value]);

  const handleDrag = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    try {
      validateFileSize(file, maxSizeMB);
      onChange?.(file);
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      }
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange?.(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return {
    dragActive,
    previewUrl,
    inputRef,
    handleDrag,
    handleDrop,
    handleChange,
    handleRemove,
  };
}
