"use client";

import Link from "next/link";
import { useState } from "react";

import {
  loginFormSchema,
  type LoginFormData,
} from "@/src/features/auth/schemas/authSchemas";
import SubmitButton from "@/src/shared/components/atoms/submit-button/submit-button";
import TextBox from "@/src/shared/components/atoms/text-box/text-box";
import InputForm from "@/src/shared/components/organisms/input-form/input-form";

export default function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (data: LoginFormData) => {
    const validatedData = loginFormSchema.safeParse(data);

    if (!validatedData.success) {
      setError(
        validatedData.error.issues[0]?.message ??
          "Vui lòng nhập lại thông tin đăng nhập.",
      );
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      // Placeholder for real login API integration.
      await new Promise((resolve) => {
        setTimeout(resolve, 900);
      });
    } catch {
      setError("Đăng nhập thất bại. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <InputForm<LoginFormData>
      id="login-form"
      defaultValues={{ email: "", password: "" }}
      onSubmit={handleSubmit}
    >
      <div className="space-y-5 mt-6">
        {error && (
          <div className="rounded-lg border border-destructive bg-background p-3 text-sm text-destructive">
            {error}
          </div>
        )}

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
