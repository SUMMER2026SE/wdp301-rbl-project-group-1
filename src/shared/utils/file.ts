import { SIZES } from "@/src/shared/constants/file";
export function validateFileSize(file: File, maxSizeMB: number) {
  if (file.size > maxSizeMB * 1024 * 1024) {
    throw new Error("File too large");
  }
}

export const formatFileSize = (bytes: number) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = [SIZES.BYTES, SIZES.KB, SIZES.MB, SIZES.GB, SIZES.TB];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};
