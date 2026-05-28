import { z } from "zod";

export const tutorBasicInfoSchema = z.object({
 fullName: z.string().min(1, "Họ và tên không được để trống"),
 email: z.string().email("Email không hợp lệ").min(1, "Email không được để trống"),
 phone: z.string().min(10, "Số điện thoại không hợp lệ"),
 address: z.string().optional(),
 bio: z.string().max(500, "Bio không quá 500 ký tự").optional(),
 subjectIds: z.array(z.string()).min(1, "Vui lòng chọn ít nhất 1 môn học"),
 gradeIds: z.array(z.string()).min(1, "Vui lòng chọn ít nhất 1 cấp lớp"),
 hourlyRate: z.number().min(0, "Học phí phải lớn hơn 0"),
 photoFiles: z.any().optional(),
});

export const tutorCredentialsSchema = z.object({
 degreeFiles: z.any().optional(),
 certificateFiles: z.any().optional(),
 identityFiles: z.any().optional(),
});

export const tutorExperienceSchema = z.object({
 experience: z.string().max(1000, "Kinh nghiệm không quá 1000 ký tự").optional(),
 achievements: z.string().optional(),
 urls: z.array(z.string().url("URL không hợp lệ").or(z.literal(''))).optional(),
});

export const tutorRegistrationSchema = z.object({
 ...tutorBasicInfoSchema.shape,
 ...tutorCredentialsSchema.shape,
 ...tutorExperienceSchema.shape,
 agreedToTerms: z.boolean().refine(val => val === true, "Bạn phải đồng ý với các điều khoản"),
});

export type TutorRegistrationData = z.infer<typeof tutorRegistrationSchema>;
