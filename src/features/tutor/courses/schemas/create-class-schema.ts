import { z } from "zod";

export const createClassSchema = z.object({
  className: z.string().min(1, "Tên lớp học là bắt buộc"),
  subject: z.string().min(1, "Vui lòng chọn môn học"),
  description: z.string().optional(),
  maxStudents: z.number().min(1, "Số học sinh phải lớn hơn 0"),
});

export type CreateClassFormValues = z.infer<typeof createClassSchema>;
