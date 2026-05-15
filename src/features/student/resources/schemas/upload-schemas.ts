import { z } from "zod";

export const uploadDocumentSchema = z.object({
  title: z
    .string()
    .min(1, "Tiêu đề không được để trống")
    .max(100, "Tiêu đề không quá 100 ký tự"),
  description: z.string().max(500, "Mô tả không quá 500 ký tự"),
  category: z.string().min(1, "Vui lòng chọn danh mục"),
  file: z
    .instanceof(File, { message: "Vui lòng chọn tệp" })
    .refine((file) => file.size <= 50 * 1024 * 1024, "File không quá 50MB")
    .refine(
      (file) =>
        [
          "application/pdf",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          "video/mp4",
        ].includes(file.type),
      "Chỉ hỗ trợ PDF, Word, Video",
    ),
});

export type UploadDocumentFormValues = z.infer<typeof uploadDocumentSchema>;
