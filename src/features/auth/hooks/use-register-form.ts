import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useRegisterMutation } from "@/src/features/auth/authApi";
import type { RegisterFormData } from "@/src/features/auth/schemas/authSchemas";

export function useRegisterForm() {
  const router = useRouter();
  const [registerUser, { isLoading: isSubmitting }] = useRegisterMutation();

  const handleSubmit = async (data: RegisterFormData) => {
    try {
      await registerUser({
        registerDto: {
          email: data.email,
          password: data.password,
          role: "STUDENT",
          nickname: data.fullname,
          phone: data.phone,
          dateOfBirth: data.dateOfBirth,
          studentData: {
            school: data.school || undefined,
            learningGoal: data.learningGoal || undefined,
            subjectIds: data.subjectIds,
            gradeIds: data.gradeIds,
          },
        },
      }).unwrap();

      toast.success("Đăng ký thành công! Vui lòng xác thực email.");
      router.push(`/verify-otp?email=${encodeURIComponent(data.email)}&type=verify-email`);
    } catch (err: unknown) {
      const error = err as { data?: { message?: string } };
      toast.error(
        error?.data?.message ?? "Đăng ký thất bại. Vui lòng thử lại."
      );
    }
  };

  return {
    handleSubmit,
    isSubmitting,
  };
}
