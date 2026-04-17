"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { authApi, useLoginMutation } from "@/src/features/auth/authApi";
import { setAuth } from "@/src/features/auth/authSlice";
import {
  loginFormSchema,
  type LoginFormData,
} from "@/src/features/auth/schemas/authSchemas";
import SubmitButton from "@/src/shared/components/atoms/submit-button/submit-button";
import TextBox from "@/src/shared/components/atoms/text-box/text-box";
import InputForm from "@/src/shared/components/organisms/input-form/input-form";
import { useAppDispatch } from "@/src/shared/store/hooks";
import { toast } from "sonner";

export default function LoginForm() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [login, { isLoading }] = useLoginMutation();

  const handleSubmit = async (data: LoginFormData) => {
    const validatedData = loginFormSchema.safeParse(data);

    if (!validatedData.success) return;

    try {
      const response = await login({
        loginDto: validatedData.data,
      }).unwrap();

      dispatch(
        setAuth({
          accessToken: response.data.accessToken,
        }),
      );

      dispatch(
        authApi.util.upsertQueryData("getMe", undefined, {
          success: true,
          message: response.message,
          data: response.data.user,
        }),
      );

      router.push("/student/home");
    } catch {
      toast.error(
        "Đăng nhập thất bại. Vui lòng kiểm tra thông tin và thử lại.",
      );
    }
  };

  return (
    <InputForm<LoginFormData>
      id="login-form"
      resolver={zodResolver(loginFormSchema)}
      defaultValues={{ email: "", password: "" }}
      onSubmit={handleSubmit}
    >
      <div className="space-y-5 mt-6">
        <TextBox
          id="email"
          label="Email"
          name="email"
          type="text"
          placeholder="name@example.com"
          inputClassName="h-12"
        />
        <TextBox
          id="password"
          label="Mật khẩu"
          name="password"
          type="password"
          placeholder="••••••••"
          inputClassName="h-12"
        />
      </div>

      <div className="flex items-center justify-between text-sm mt-6 mb-2">
        <label className="flex items-center gap-2 text-muted-foreground">
          <input
            type="checkbox"
            className="size-4 rounded border-input bg-background"
          />
          Ghi nhớ đăng nhập
        </label>
        <Link href="#" className="font-medium text-primary">
          Quên mật khẩu?
        </Link>
      </div>

      <SubmitButton isLoading={isLoading}>Đăng nhập</SubmitButton>
    </InputForm>
  );
}
