export interface FileUploadProps {
  value?: File | null;
  onChange?: (file: File | null) => void;
  accept?: string;
  maxSizeMB?: number;
  className?: string;
  placeholder?: string;
  helperText?: string;
}