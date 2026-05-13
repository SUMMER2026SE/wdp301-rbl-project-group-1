'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowLeft,
  Eye,
  EyeOff,
  KeyRound,
  Check,
  Circle,
} from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';

import {
  resetPasswordFormSchema,
  type ResetPasswordFormData,
} from '@/src/features/auth/schemas/authSchemas';
import { Button } from '@/src/shared/components/ui/button';
import SubmitButton from '@/src/shared/components/atoms/submit-button/submit-button';
import InputForm from '@/src/shared/components/organisms/input-form/input-form';
import TextBox from '@/src/shared/components/atoms/text-box/text-box';

interface PasswordRule {
  label: string;
  test: (value: string) => boolean;
}

const PASSWORD_RULES: PasswordRule[] = [
  { label: 'Ít nhất 8 ký tự', test: (v) => v.length >= 8 },
  { label: 'Chứa ít nhất 1 chữ hoa', test: (v) => /[A-Z]/.test(v) },
  { label: 'Chứa ít nhất 1 số', test: (v) => /\d/.test(v) },
  {
    label: 'Chứa ít nhất 1 ký tự đặc biệt (VD: @, #, $, %)',
    test: (v) => /[^A-Za-z0-9]/.test(v),
  },
];

export default function ResetPasswordForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [password, setPassword] = useState('');

  const ruleResults = useMemo(
    () => PASSWORD_RULES.map((rule) => rule.test(password)),
    [password],
  );

  const handleSubmit = async (data: ResetPasswordFormData) => {
    try {
      // TODO: call reset password API
      console.log('Reset password:', data.new_password);
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch {
      // handled by form
    }
  };

  return (
    <main className="flex min-h-screen w-full bg-background">
      {/* Left Panel: Decorative */}
      <section className="relative hidden w-1/2 overflow-hidden bg-primary lg:flex lg:items-center lg:justify-center">
        <Image
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuDS4tJNEtWodcEpslnm0HX0AB3UBY3nfGgaB-4JwbhFqjmUJmEo2SPJ2eAuNMI82Kn6xJEMnCQ-fAuZb7MIBr2_nCWDy3M-4Li7yfUWuBhlB8EU65VjcFQjCnP2FGSwNaEcBrpUGYTH3zhFUyfPIMkIYKrgRG2Z_Gu0p_xA7UIMfIvrNcgsx1rjU-8MEFN6SIEC5tj_TZJZ-g6wqIMCG3JNOgl_tlD7tTXsnwNQuCfke-jjmqxc14VeLFDgMpGKZ14Qpg1Sy4ZJ0qc"
          alt="Students studying together"
          fill
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-cover opacity-90"
          priority
        />
        <div className="absolute inset-0 bg-primary/35" />
        <div className="absolute inset-0 bg-linear-to-t from-background/70 via-transparent to-transparent" />

        <div className="relative z-10 max-w-lg p-12 text-primary-foreground">
          <div className="mb-6 flex items-center gap-3">
            <h2 className="text-2xl font-bold">Tutor Connect</h2>
          </div>
          <h1 className="mb-6 text-5xl font-black leading-tight">
            Bảo mật tài khoản của bạn.
          </h1>
          <p className="text-lg leading-relaxed text-primary-foreground/85">
            Tạo mật khẩu mạnh để tiếp tục hành trình học tập an toàn và không bị
            gián đoạn cùng các gia sư hàng đầu.
          </p>
        </div>
      </section>

      {/* Right Panel: Reset Password Form */}
      <section className="flex w-full items-center justify-center bg-background p-6 sm:p-12 lg:w-1/2">
        <div className="w-full max-w-md space-y-8">
          {/* Back link */}
          <Link
            href="/login"
            className="group inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"
          >
            <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-1" />
            Quay lại đăng nhập
          </Link>

          {/* Header */}
          <div>
            <div className="mb-6 flex size-14 items-center justify-center rounded-xl bg-secondary text-primary">
              <KeyRound className="size-7" />
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-foreground">
              Đặt lại mật khẩu mới
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Tạo mật khẩu mới an toàn để bảo vệ tài khoản của bạn.
            </p>
          </div>

          {/* Form */}
          <InputForm<ResetPasswordFormData>
            resolver={zodResolver(resetPasswordFormSchema)}
            defaultValues={{ new_password: '', confirm_password: '' }}
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            {/* New Password */}
            <div className="relative">
              <TextBox
                id="new_password"
                name="new_password"
                label="Mật khẩu mới"
                type={showPassword ? 'text' : 'password'}
                placeholder="Nhập mật khẩu mới"
                inputClassName="h-11 pr-10"
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => setShowPassword((p) => !p)}
                className="absolute right-0 top-[38px] pr-3 text-muted-foreground hover:text-foreground"
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeOff className="size-4" />
                ) : (
                  <Eye className="size-4" />
                )}
              </Button>
            </div>

            {/* Confirm Password */}
            <div className="relative">
              <TextBox
                id="confirm_password"
                name="confirm_password"
                label="Xác nhận mật khẩu mới"
                type={showConfirm ? 'text' : 'password'}
                placeholder="Nhập lại mật khẩu mới"
                inputClassName="h-11 pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => setShowConfirm((p) => !p)}
                className="absolute right-0 top-[38px] pr-3 text-muted-foreground hover:text-foreground"
                tabIndex={-1}
              >
                {showConfirm ? (
                  <EyeOff className="size-4" />
                ) : (
                  <Eye className="size-4" />
                )}
              </Button>
            </div>

            {/* Password Requirements */}
            <div className="rounded-lg border bg-muted/50 p-4">
              <p className="mb-3 text-xs font-semibold text-muted-foreground">
                Mật khẩu của bạn phải bao gồm:
              </p>
              <ul className="space-y-2">
                {PASSWORD_RULES.map((rule, i) => {
                  const passed = ruleResults[i];
                  return (
                    <li
                      key={rule.label}
                      className="flex items-center gap-2 text-sm"
                    >
                      {passed ? (
                        <Check className="size-4 text-primary" />
                      ) : (
                        <Circle className="size-4 text-muted-foreground" />
                      )}
                      <span
                        className={
                          passed ? 'text-foreground' : 'text-muted-foreground'
                        }
                      >
                        {rule.label}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Submit */}
            <SubmitButton>Cập nhật mật khẩu</SubmitButton>
          </InputForm>
        </div>
      </section>
    </main>
  );
}
