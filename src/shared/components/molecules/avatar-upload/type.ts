export interface AvatarUploadProps {
  value?: File | null;
  onChange?: (file: File | null) => void;
  className?: string;
  accept?: string;
  maxSizeMB?: number;
}
