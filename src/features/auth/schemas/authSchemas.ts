import { z } from "zod";

export const loginFormSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Vui lòng nhập email!" })
    .email({ message: "Vui lòng nhập email hợp lệ!" }),
  password: z.string().min(6, { message: "Vui lòng nhập mật khẩu hợp lệ (ít nhất 6 ký tự)!" }),
});

export type LoginFormData = z.infer<typeof loginFormSchema>;

export const registerFormSchema = z.object({
  fullname: z.string().min(1, { message: "Vui lòng nhập họ và tên!" }),
  email: z.string().min(1, { message: "Vui lòng nhập email!" }).email({ message: "Email không hợp lệ!" }),
  phone: z.string().min(10, { message: "Vui lòng nhập số điện thoại!" }),
  password: z.string().min(6, { message: "Mật khẩu tối thiểu 6 ký tự!" }),
  confirmPassword: z.string().min(6, { message: "Vui lòng xác nhận mật khẩu!" }),
  grade: z.string().min(1, { message: "Vui lòng chọn lớp!" }),
  subjects: z.array(z.string()).min(1, { message: "Vui lòng chọn ít nhất 1 môn học!" }),
  parentName: z.string().min(1, { message: "Vui lòng nhập họ tên phụ huynh!" }),
  parentPhone: z.string().min(10, { message: "Vui lòng nhập ĐT phụ huynh!" }),
  parentEmail: z.string().optional(),
  termsAccepted: z.boolean().refine((val) => val === true, {
    message: "Bạn phải đồng ý với điều khoản!",
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Mật khẩu không trùng khớp!",
  path: ["confirmPassword"],
});

export type RegisterFormData = z.infer<typeof registerFormSchema>;

export const verifyOtpFormSchema = z.object({
  otp: z.string().length(6, { message: "Mã OTP phải gồm 6 chữ số!" }),
});

export type VerifyOtpFormData = z.infer<typeof verifyOtpFormSchema>;

export const forgotPasswordFormSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Vui lòng nhập email!" })
    .email({ message: "Vui lòng nhập email hợp lệ!" }),
});

export type ForgotPasswordFormData = z.infer<typeof forgotPasswordFormSchema>;

export const resetPasswordFormSchema = z.object({
  new_password: z
    .string()
    .min(8, { message: "Mật khẩu tối thiểu 8 ký tự!" })
    .regex(/[A-Z]/, { message: "Mật khẩu phải chứa ít nhất 1 chữ hoa!" })
    .regex(/\d/, { message: "Mật khẩu phải chứa ít nhất 1 số!" })
    .regex(/[^A-Za-z0-9]/, { message: "Mật khẩu phải chứa ít nhất 1 ký tự đặc biệt!" }),
  confirm_password: z.string().min(1, { message: "Vui lòng xác nhận mật khẩu!" }),
}).refine((data) => data.new_password === data.confirm_password, {
  message: "Mật khẩu không trùng khớp!",
  path: ["confirm_password"],
});

export type ResetPasswordFormData = z.infer<typeof resetPasswordFormSchema>;